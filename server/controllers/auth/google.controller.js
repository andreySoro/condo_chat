const User = require("../../models/User");
const admin = require("firebase-admin");
const axios = require("axios");
const {
  extractUserIdFromToken,
} = require("../../utils/extractUserIdFromToken");

const googleSignIn = async (req, res) => {
  const { idToken } = req.body;
  console.log("REQ", req.body, idToken);
  const { data } = await axios.post(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );
  console.log("userData", data);
  const { email, sub, name, picture } = data;
  const user = await User.findOne({ email: email });
  console.log("user", user);
  if (user) {
    // const token = await admin.auth().createCustomToken(user.id.toString());
    return res.status(200).json({
      registered: true,
      accessToken: idToken,
      user,
      navigate_to: "BottomTab",
    });
  } else {
    console.log("uid token", idToken);
    const uid = await extractUserIdFromToken(idToken);
    if (uid) {
      const newUser = await User.create({
        id: uid,
        name,
        email,
        profileImgUri: picture,
      });
      await newUser.save();
      return res
        .status(200)
        .json({ user: newUser, accessToken: idToken, navigate_to: "Name" });
    }
  }
};

module.exports = googleSignIn;
