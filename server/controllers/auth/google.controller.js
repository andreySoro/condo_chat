const User = require("../../models/User");
const axios = require("axios");
const {
  extractUserIdFromToken,
} = require("../../utils/extractUserIdFromToken");
const admin = require("firebase-admin");

const googleSignIn = async (req, res) => {
  const { idToken } = req.body;

  const { data } = await axios.post(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );

  const { email, sub, name, picture } = data;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = await admin
      .auth()
      .createCustomToken(user.id.toString(), { email });
    return res.status(200).json({
      registered: true,
      accessToken: token,
      user,
      navigate_to: "BottomTab",
    });
  } else {
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
        .json({ user: newUser, accessToken: idToken, navigate_to: "Terms" });
    }
  }
};

module.exports = googleSignIn;
