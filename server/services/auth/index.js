const axios = require("../../config/axiosConfig.js");
const admin = require("firebase-admin");

const revokeToken = async () => {
  return await admin
    .auth()
    .revokeRefreshTokens("m2kNbCW6wFWgLEeXsZcxvKoMRhf2")
    .then(() => admin.auth().getUser("m2kNbCW6wFWgLEeXsZcxvKoMRhf2"))
    .then((userRecord) => {
      return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    })
    .then((timestamp) => {
      console.log(`Tokens revoked at: ${timestamp}`);
      return true;
    })
    .catch((err) => {
      console.log(err.message);
      return false;
    });
};

const signInWithPasswordCall = async (req) => {
  const { email, password } = req.body;
  if (typeof email === "string" && typeof password === "string") {
    return await axios
      .post(
        "/accounts:signInWithPassword?key=" + process.env.FIREBASE_API_KEY,
        {
          email: req.body.email,
          password: req.body.password,
          returnSecureToken: true,
        }
      )
      .then((res) => res.data)
      .catch((err) => err);
  }
};

const forgotPasswordCall = async (req) => {
  const { email } = req.body;
  console.log("email", email);
  if (typeof email === "string") {
    return await axios.post(
      "/accounts:sendOobCode?key=" + process.env.FIREBASE_API_KEY,
      {
        requestType: "PASSWORD_RESET",
        email,
      }
    );
  }
};

const sendEmailConfirmationCall = async (idToken) => {
  if (typeof idToken === "string") {
    return await axios
      .post("/accounts:sendOobCode?key=" + process.env.FIREBASE_API_KEY, {
        requestType: "VERIFY_EMAIL",
        idToken: idToken,
      })
      .then((res) => {
        console.log("Email verification sent", res);
      })
      .catch((err) => err);
  }
};

const refreshTokenCall = async (req) => {
  const { refreshToken } = req.body;
  if (typeof refreshToken === "string") {
    return await axios.post("/token?key=" + process.env.FIREBASE_API_KEY, {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
  }
};

module.exports = {
  signInWithPasswordCall,
  forgotPasswordCall,
  sendEmailConfirmationCall,
  refreshTokenCall,
  revokeToken,
};
