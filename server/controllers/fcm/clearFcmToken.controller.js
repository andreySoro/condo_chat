const User = require("../../models/User");

const clearFcmToken = async (req, res) => {
  const uid = req.UserId;
  const fcmToken = req.body.fcmToken;
  if (!uid)
    return res
      .status(400)
      .send({ message: "Invalid user id. Fcm token not cleared." });
  try {
    const user = await User.findOne({ id: uid });
    if ((!user && !fcmToken) || fcmToken.trim().length === 0) {
      return res.status(404).json({
        error: "User not found or token not provided. Fcm token not cleared.",
      });
    } else {
      const itemNum = user.fcmTokens.indexOf(fcmToken);
      if (itemNum > -1) {
        user.fcmTokens.splice(itemNum, 1);
        await user.save();
        return res.status(200).json({ message: "Fcm token deleted." });
      } else {
        return res
          .status(200)
          .json({ message: "Fcm token not found on the user object." });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Fcm token not cleared.", error: err });
  }
};

module.exports = { clearFcmToken };
