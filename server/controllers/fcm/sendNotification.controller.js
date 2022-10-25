const User = require("../../models/User");
const admin = require("firebase-admin");

const sendFcmNotification = async (req, res) => {
  const userIds = req.body.userIds;
  const { message, title, chatId } = req.body;

  const listOfFcmTokens = () => {
    return userIds.map(async (userId) => {
      const user = await User.findOne({ id: userId });
      return user.fcmTokens;
    });
  };
  const result = await Promise.all(listOfFcmTokens()).then((res) => res.flat());
  await admin
    .messaging()
    .sendToDevice(result, {
      data: {
        chatId: String(chatId),
      },
      notification: {
        title,
        body: message,
      },
    })
    .then((res) => console.log("SUCCESSFULY SENT NOTIFICATIONS", res))
    .catch((err) => console.log("ERROR", err));

  res.status(200).json({ message: "Notification sent" });
};

module.exports = { sendFcmNotification };
