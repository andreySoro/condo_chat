const express = require("express");
const router = express.Router();
const axios = require("../../config/axiosConfig.js");

router.post("/", async (req, res) => {
  try {
    const result = await axios.post(
      "/token?key=" + process.env.FIREBASE_API_KEY,
      {
        grant_type: "refresh_token",
        refresh_token: req.body.refreshToken,
      }
    );

    return res.status(200).send(result.data);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

module.exports = router;
