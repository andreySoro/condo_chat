const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }
  let decodedToken = null;
  if (token) {
    decodedToken = jwt.decode(token);
  }
  if (!decodedToken || !decodedToken.exp) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (new Date(decodedToken.exp * 1000).getTime() > Date.now()) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = requireAuth;
