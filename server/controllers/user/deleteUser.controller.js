const User = require("../../models/User");
const admin = require("firebase-admin");

const deleteUser = async (req, res) => {
  const { UserId } = req;
  if (!UserId) return res.status(400).json({ msg: "No user id provided" });
  console.log("userid", UserId);
  const user = await User.deleteOne({ id: UserId });
  console.log("DELETED USER", user);
  if (user?.deletedCount != 1) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    await admin.auth().deleteUser(UserId);
  } catch (error) {
    return res.status(404).json({ message: "Error deleting user" });
  }
  return res.status(200).json({ message: "User deleted successfully" });
};

module.exports = deleteUser;
