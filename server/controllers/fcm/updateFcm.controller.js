const User = require("../../models/User");

const updateFcmToken = async (req, res) => {
  const fcmToken = req.body.fcmToken;
  const userId = req.UserId;
  const existedUser = await User.findOne({ id: userId });
  if (existedUser) {
    if (existedUser.fcmTokens.includes(fcmToken)) {
      console.log("FCM token already exists");
      res.status(200).json({ message: "FCM token already exists" });
    } else {
      existedUser.fcmTokens.push(fcmToken);
      await existedUser.save();
      res.status(200).json({ message: "FCM token added" });
    }
  }
};

module.exports = { updateFcmToken };
