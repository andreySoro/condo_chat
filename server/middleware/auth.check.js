const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { rule } = require("graphql-shield");

//AUTH FOR REST END POINTS (PHOTO UPLOAD etc)
const requireAuth = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decodedToken = jwt.decode(token);
  if (
    !decodedToken &&
    !decodedToken?.exp &&
    (!decodedToken?.email || !decodedToken?.claims?.email)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingUser = await User.findOne({
    email: decodedToken.email || decodedToken.claims.email,
  });
  if (
    new Date(decodedToken.exp * 1000).getTime() > Date.now() &&
    existingUser
  ) {
    req.UserId = existingUser.id;
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

//AUTH CHECK FOR GRAPHQL END POINTS
const graphQlAuth = rule()(async (parents, args, ctx, info) => {
  if (ctx?.headers?.authorization) {
    const token = ctx.headers.authorization.split(" ")[1];
    if (token) {
      const decodedToken = jwt.decode(token);
      if (!decodedToken) return false;
      let existingUser = await User.findOne({
        email: decodedToken.email || decodedToken.claims.email,
      });

      if (
        decodedToken &&
        existingUser &&
        new Date(decodedToken.exp * 1000) > Date.now()
      ) {
        ctx.headers.userId = existingUser.id;
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
