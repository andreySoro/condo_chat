const { revokeToken } = require("../../services/auth");
const admin = require("firebase-admin");

const signOut = async (req, res) => {
  const result = await admin
    .auth()
    .revokeRefreshTokens("m2kNbCW6wFWgLEeXsZcxvKoMRhf2")
    .then(() => admin.auth().getUser("m2kNbCW6wFWgLEeXsZcxvKoMRhf2"))
    .then((userRecord) => {
      return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    })
    .then((timestamp) => {
      console.log(`Tokens revoked at: ${timestamp}`);
    })
    .catch((err) => err.message);
  console.log("RESULT TOKEN", result);
  return res.status(200).json({ message: "signOut" });
};

module.exports = signOut;
