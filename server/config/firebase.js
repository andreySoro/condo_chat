const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
};

const firebase = require("firebase/compat/app");

module.exports = firebase.initializeApp(config);
