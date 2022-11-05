const User = require("../../models/User");
const { signInWithPasswordCall } = require("../../services/auth");
const { doesUserExistCall } = require("../../services/user");

const signIn = async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res
      .status(400)
      .send({ message: "Invalid request, incorrect email or password" });
    return;
  }

  const user = await signInWithPasswordCall(req);

  if (user?.response?.data?.error?.code === 400) {
    return res.status(400).send({
      error: {
        message: "User email or password is incorrect",
      },
    });
  }

  const doesUserExist = await doesUserExistCall(req);

  const localUser = await User.findOne({ id: user.localId });
  if (!localUser)
    return res.status(400).send({ message: "User does not exist in db" });

  return res.status(200).send({
    refreshToken: user.refreshToken,
    accessToken: user.idToken,
    email: user.email,
    id: localUser.id,
    emailVerified: doesUserExist ? doesUserExist.emailVerified : false,
    expiresIn: user.expiresIn,
  });
};

module.exports = signIn;
