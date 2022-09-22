const jwt = require("jsonwebtoken");
const extractUserIdFromToken = (auth) => {
  const userToken = auth.split(" ")[1];
  const { user_id } = jwt.decode(userToken);
  return user_id;
};

module.exports = { extractUserIdFromToken };
