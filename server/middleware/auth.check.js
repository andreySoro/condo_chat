const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken = null;
  if (token) {
    decodedToken = jwt.decode(token);
  }

  if (new Date(decodedToken.exp * 1000).getTime() > Date.now()) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = requireAuth;
