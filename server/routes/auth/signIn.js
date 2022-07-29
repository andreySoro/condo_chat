const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const axios = require("../../config/axiosConfig.js");
const User = require("../../models/User");

router.post("/", async (req, res) => {
  console.log("BODY!!!", req.body);
  if (!req.body || !req.body.email || !req.body.password) {
    res
      .status(400)
      .send({ message: "Invalid request, incorrect email or password" });
    return;
  }

  const user = await axios
    .post(":signInWithPassword?key=" + process.env.FIREBASE_API_KEY, {
      email: req.body.email,
      password: req.body.password,
      returnSecureToken: true,
    })
    .then((res) => res.data)
    .catch((err) => err);

  if (user?.response?.data?.error?.code === 400) {
    return res.status(400).send({
      error: {
        message: "User email or password is incorrect",
      },
    });
  }
  const doesUserExist = await admin
    .auth()
    .getUserByEmail(req.body.email)
    .then((res) => res)
    .catch((err) => {
      console.log(err.message);
      return false;
    });
  const localUser = await User.findOne({ id: user.localId });
  console.log("DA USER !===", user);
  return res.status(200).send({
    refreshToken: user.refreshToken,
    accessToken: user.idToken,
    email: user.email,
    id: localUser.id,
    emailVerified: doesUserExist ? doesUserExist.emailVerified : false,
    expiresIn: user.expiresIn,
  });
});

module.exports = router;
