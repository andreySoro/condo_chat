const express = require("express");
const router = express.Router();
const axios = require("../../config/axiosConfig.js");

router.use("/", async (req, res) => {
  try {
    await axios.post(":sendOobCode?key=" + process.env.FIREBASE_API_KEY, {
      requestType: "PASSWORD_RESET",
      email: req.body.email,
    });
    return res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.log("ERROR FORGOT PASSWORD", error);
  }
});

module.exports = router;
