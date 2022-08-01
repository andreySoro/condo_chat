const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const axios = require("../../config/axiosConfig.js");
const User = require("../../models/User");

router.post("/", async (req, res) => {
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
    console.log("DA USER BEING PASSED IN: ", req.body.email, req.body.password);
    return await axios
      .post("/accounts:signUp?key=" + process.env.FIREBASE_API_KEY, {
        email: req.body.email,
        password: req.body.password,
        returnSecureToken: true,
      })
      .then((res) => res.data)
      .catch((err) => err.response.data);
  };

  //UTILITY FUNCTION TO SEND EMAIL CONFIRMATION
  async function sendEmailConfirmation(idToken) {
    await axios
      .post("/accounts:sendOobCode?key=" + process.env.FIREBASE_API_KEY, {
        requestType: "VERIFY_EMAIL",
        idToken: idToken,
      })
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

    if (newUser) {
      const loacalUser = new User({
        id: newUser.localId,
        email: req.body.email,
      });
      await loacalUser.save();
      return res.status(201).send({
        user: newUser,
        message: "User created successfully",
        emailVerification: req.body.emailVerification,
      });
    } else {
      return res.status(400).send({
        error: {
          message: "User could not be created",
        },
      });
    }
  }
});

module.exports = router;
