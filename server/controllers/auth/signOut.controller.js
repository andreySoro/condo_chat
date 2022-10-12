const { revokeToken } = require("../../services/auth");
const getUidFromToken = require("../../utils/getUidFromToken");

const signOut = async (req, res) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token provided" });
  const uid = await getUidFromToken(token);
  if (!uid) return res.status(400).json({ message: "Invalid token" });

  const revoked = await revokeToken(uid);
  if (!revoked)
    return res.status(400).json({ message: "Could not revoke token" });
  return res.status(200).json({ message: "signOut" });
};

module.exports = signOut;
