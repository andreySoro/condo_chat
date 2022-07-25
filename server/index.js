const express = require("express");
require("dotenv").config();
require("firebase/compat/auth");
const port = process.env.PORT || 5000;
const axios = require("axios").default;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const User = require("./models/User");

const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const auth = require("firebase/auth");

//FIREBASE ADMIN SDK INIT
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// BACKEND INITIALIZATION
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/signUp", async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send("Invalid request");
    return;
  }

  const doesUserExist = await admin
    .auth()
    .getUserByEmail(req.body.email)
    .then((res) => res)
    .catch((err) => {
      console.log(err.message);
      return false;
    });

  // if (doesUserExist) {
  //   return res.status(400).send({ error: { message: "User already exist." } });
  // }

  const createNewUser = async () => {
    return await axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAfz7a3M2b45CxwPxVVSwtFvXKtDkO37jw",
        {
          email: req.body.email,
          password: req.body.password,
          returnSecureToken: true,
        }
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);
  };

  const newUser = doesUserExist ? doesUserExist : await createNewUser();
  console.log("NEW USER", newUser);
  const isUserEmailVerified = await admin
    .auth()
    .getUser(newUser?.localId ? newUser.localId : newUser.uid)
    .then((res) => res.emailVerified);

  console.log("IS EMAIL VERIFIED", isUserEmailVerified);
  if (isUserEmailVerified) {
    return res.status(200).send({ message: "User exists, email verified" });
  }

  if (!isUserEmailVerified) {
    (async function () {
      return await axios
        .post(
          "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAfz7a3M2b45CxwPxVVSwtFvXKtDkO37jw",
          {
            requestType: "VERIFY_EMAIL",
            idToken: newUser.idToken,
          }
        )
        .then((res) => {
          console.log("Email verification sent", res);
          res.status(200).send("Email verification sent");
          return {
            data1: res.data,
            data2: res.status,
          };
        })
        .catch((err) => err);
    })();
  }

  // if (
  //   doesUserExist?.message ===
  //   "There is no user record corresponding to the provided identifier."
  // ) {
  //   // console.log("USEEEER", await admin.auth().getUser(newUser.localId));
  //   sendVerificationEmail();
  //   console.log("THIS IS THE EMAIL VERIFICATION CODE", emailVer);
  // } else if (doesUserExist && isUserEmailVerified === false) {
  //   sendVerificationEmail();
  // }
  // //FIREBASE
  // newUser = await axios
  //   .post(
  //     "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAfz7a3M2b45CxwPxVVSwtFvXKtDkO37jw",
  //     {
  //       email: req.body.email,
  //       password: req.body.password,
  //       returnSecureToken: true,
  //     }
  //   )
  //   .then((res) => res.data)
  //   .catch((err) => err.response.data);

  // await admin
  //   .auth()
  //   .createUser({
  //     email: req.body.email,
  //     password: req.body.password,
  //   })
  //   .then((userRecord) => {
  //     // console.log("Successfully created new user:", userRecord);
  //     return userRecord;
  //   })
  //   .catch((error) => {
  //     console.log("Error creating new user:", error);
  //   });

  // if (!newUser) {
  //   res.status(400).send("Cannot create user");
  //   return;
  // }
  // console.log("Successfully created new user:", newUser);
  // //MONGODB
  // const user = new User({
  //   id: newUser.localId,
  //   email: newUser.email,
  // });
  // await user.save();
  // res.status(200).send(newUser);
});

app.post("/signIn", async (req, res) => {
  console.log("BODY!!!", req.body);
  if (!req.body || !req.body.email || !req.body.password) {
    res
      .status(400)
      .send({ message: "Invalid request, incorrect email or password" });
    return;
  }

  const user = await axios
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
  AIzaSyAfz7a3M2b45CxwPxVVSwtFvXKtDkO37jw`,
      {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true,
      }
    )
    .then((res) => res.data)
    .catch((err) => err);

  res.status(200).send(user);
  console.log("DA USER", user);
  console.log("USEEEER", await admin.auth().getUser(user.localId));
  // const userUid = admin
  //   .auth()
  //   .verifyIdToken(user.idToken)
  //   .then((decodedToken) => decodedToken.uid)
  //   .catch((error) => {
  //     // Handle error
  //     console.log("Error verifying token", error);
  //   });
  const localUser = await User.findOne({ id: user.localId });
  console.log("LOCAL USER = ", localUser);
  // admin
  //   .auth()
  //   .getUser(req.body.uid)
  //   .then((userRecord) => {
  //     // See the UserRecord reference doc for the contents of userRecord.
  //     console.log("Successfully fetched user data", userRecord.toJSON());
  //   })
  //   .catch((error) => {
  //     console.log("Error fetching user data:", error);
  //   });

  //FIREBASE
  // const userFire = await auth
  //   .signInWithEmailAndPassword(req.body.email, req.body.password)
  //   .then((res) => res)
  //   .catch(function (error) {
  //     console.log("fifrebase error", error);
  //   });

  // if (!userFire) {
  //   res
  //     .status(400)
  //     .send({ message: "Invalid request, incorrect email or password" });
  //   return;
  // }
  // const userMongo = await User.findOne({ id: userFire.user.uid });

  // if (!userMongo) {
  //   res.status(400).send({ message: "User does not exist" });
  //   return;
  // }
  // if (
  //   userMongo.email !== userFire.user.email &&
  //   userMongo.id !== userFire.user.uid
  // ) {
  //   res.status(400).send({ error: { message: "User does not exist" } });
  //   return;
  // }
  // res.status(200).send({
  //   id: userFire.user.uid,
  //   email: userFire.user.email,
  //   validationResult: userFire.user.toJSON().stsTokenManager,
  // });
  // res.send(`Hello there ${user.user.email}`);
});

// CONNECT TO DB
connectDB();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server running on port ${port}`));
