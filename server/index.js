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

// BACKEND INITIALIZATION-
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

  //UTILITY FUNCTION TO CREATE USER
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

  //UTILITY FUNCTION TO SEND EMAIL CONFIRMATION
  async function sendEmailConfirmation(idToken) {
    console.log("SEND EMAIL VERIFICATION", idToken);
    await axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAfz7a3M2b45CxwPxVVSwtFvXKtDkO37jw",
        {
          requestType: "VERIFY_EMAIL",
          idToken: idToken,
        }
      )
      .then((res) => {
        console.log("Email verification sent", res);
      })
      .catch((err) => err);
  }

  if (doesUserExist) {
    return res.status(400).send({
      error: {
        message: "User already exist, try to sign in or reset your password",
      },
    });
  } else {
    const newUser = await createNewUser();
    if (req.body.emailVerification) {
      sendEmailConfirmation(newUser.idToken);
    }

    const loacalUser = new User({
      id: newUser.localId,
      email: req.body.email,
    });
    await loacalUser.save();
    return res.status(201).send({
      user: newUser,
      message: "User created successfully",
    });
  }
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

  console.log("DA USER", user.response);
  if (user?.response?.data?.error?.code === 400) {
    return res.status(400).send({
      error: {
        message: "User email or password is incorrect",
      },
    });
  }

  const localUser = await User.findOne({ id: user.localId });

  return res.status(200).send({
    refreshToken: user.refreshToken,
    accessToken: user.idToken,
    email: user.email,
    id: localUser.id,
  });
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
