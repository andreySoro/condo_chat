const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { rule } = require("graphql-shield");
const admin = require("firebase-admin");

const requireAuth = async (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let decodedToken = null;
  if (token) {
    decodedToken = await admin
      .auth()
      .verifyIdToken(token)
      .then((res) => res)
      .catch((error) => error.message);
  }
  if (!decodedToken || !decodedToken.exp) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const existingUser = await User.findOne({ id: decodedToken.user_id });
  if (
    new Date(decodedToken.exp * 1000).getTime() > Date.now() &&
    existingUser
  ) {
    return true;
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const graphQlAuth = rule()(async (parents, args, ctx, info) => {
  if (ctx?.headers?.authorization) {
    const token = ctx.headers.authorization.split(" ")[1];

    if (token) {
      const decodedToken = await admin
        .auth()
        .verifyIdToken(token)
        .then((res) => res)
        .catch((error) => error.message);
      const existingUser = await User.findOne({ id: decodedToken.uid });

      if (decodedToken && existingUser) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
});

module.exports = { requireAuth, graphQlAuth };
