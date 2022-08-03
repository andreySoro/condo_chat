const { refreshTokenCall } = require("../../services/auth");

const refreshToken = async (req, res) => {
  try {
    const result = await refreshTokenCall(req);
    return res.status(200).send(result.data);
  } catch (error) {
    console.log("ERORR", error);
    return res.status(400).send(error.message);
  }
};

module.exports = refreshToken;
