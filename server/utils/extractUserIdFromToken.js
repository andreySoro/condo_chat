const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const extractUserIdFromToken = async (auth) => {
  console.log("auth check func =", auth);
  const userToken = auth.split(" ")[1] || auth;
  console.log("user toke auth func", userToken);
  const decodedToken = jwt.decode(userToken);
  if (!decodedToken) return null;
  if (decodedToken.iss === "https://securetoken.google.com/condochatapp") {
    return decodedToken.user_id;
  } else if (decodedToken.iss === "https://accounts.google.com") {
    // const { data } = await axios.post(
    //   `https://oauth2.googleapis.com/tokeninfo?id_token=${userToken}`
    // );
    // const { email } = data;
    console.log("EMAIL DEOCDED", decodedToken.email);
    const { uid } = await admin.auth().getUserByEmail(decodedToken.email);
    return uid;
  }
};

module.exports = { extractUserIdFromToken };
