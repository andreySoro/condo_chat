const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { rule } = require("graphql-shield");
const admin = require("firebase-admin");

const requireAuth = async (req, res, next) => {
  const token =
    req?.get("Authorization")?.split(" ")[1] ||
    req?.headers?.authorization?.split(" ")[1];

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
    if (req.headers.authorization.split(" ")[1]) return next();
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
        .catch((error) => null);
      if (!decodedToken) return false;
      const existingUser = await User.findOne({ id: decodedToken.uid });

      if (
        decodedToken &&
        existingUser &&
        new Date(decodedToken.exp * 1000) > Date.now()
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
});

module.exports = { requireAuth, graphQlAuth };
