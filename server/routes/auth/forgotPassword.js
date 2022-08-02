const express = require("express");
const router = express.Router();
const axios = require("../../config/axiosConfig.js");

router.post("/", async (req, res) => {
  try {
    await axios.post(
      "/accounts:sendOobCode?key=" + process.env.FIREBASE_API_KEY,
      {
        requestType: "PASSWORD_RESET",
        email: req.body.email,
      }
    );
    return res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.log("ERROR FORGOT PASSWORD", error);
    return res.status(400).send(error.message);
  }
});

module.exports = router;
