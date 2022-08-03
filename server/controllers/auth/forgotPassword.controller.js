const { forgotPasswordCall } = require("../../services/auth");

const forgotPassword = async (req, res) => {
  try {
    await forgotPasswordCall(req);
    return res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.log("ERROR FORGOT PASSWORD", error);
    return res.status(400).send(error.message);
  }
};

module.exports = forgotPassword;
