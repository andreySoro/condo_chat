const admin = require("firebase-admin");

const getUidFromToken = async (token) => {
  const decodedToken = await admin
    .auth()
    .verifyIdToken(token)
    .then((res) => res)
    .catch((error) => null);
  if (!decodedToken) {
    return null;
  } else {
    return decodedToken.uid;
  }
};

module.exports = getUidFromToken;
