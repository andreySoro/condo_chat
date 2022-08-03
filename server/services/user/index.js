const axios = require("../../config/axiosConfig.js");
const admin = require("firebase-admin");

const doesUserExistCall = async (req) => {
  return await admin
    .auth()
    .getUserByEmail(req.body.email)
    .then((res) => res)
    .catch((err) => {
      return false;
    });
};

const createNewUserCall = async (req) => {
  return await axios
    .post("/accounts:signUp?key=" + process.env.FIREBASE_API_KEY, {
      email: req.body.email,
      password: req.body.password,
      returnSecureToken: true,
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

module.exports = {
  doesUserExistCall,
  createNewUserCall,
};
