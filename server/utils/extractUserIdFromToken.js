const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const extractUserIdFromToken = async (auth) => {
  const userToken = auth.split(" ")[1] || auth;
  const decodedToken = jwt.decode(userToken);

  if (!decodedToken) return null;
  if (decodedToken.iss === "https://securetoken.google.com/condochatapp") {
    return decodedToken.user_id;
  } else if (decodedToken.iss === "https://accounts.google.com") {
    // const { data } = await axios.post(
    //   `https://oauth2.googleapis.com/tokeninfo?id_token=${userToken}`
    // );
    // const { email } = data;
    const { uid } = await admin.auth().getUserByEmail(decodedToken.email);

    return uid;
  } else if (
    decodedToken.iss ===
    "firebase-adminsdk-zntuj@condochatapp.iam.gserviceaccount.com"
  ) {
    return decodedToken.uid;
  }
};

module.exports = { extractUserIdFromToken };
