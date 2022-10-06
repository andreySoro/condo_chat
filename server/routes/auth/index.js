const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/auth.check");
const forgotPasswordController = require("../../controllers/auth/forgotPassword.controller");
const refreshTokenController = require("../../controllers/auth/refreshToken.controller");
const signInController = require("../../controllers/auth/signIn.controller");
const signUpController = require("../../controllers/auth/signUp.controller");
const signOutController = require("../../controllers/auth/signOut.controller");

router.post("/forgotPassword", forgotPasswordController);
router.post("/refreshToken", refreshTokenController);
router.post("/signIn", signInController);
router.post("/signUp", signUpController);
router.post("/signOut", requireAuth, signOutController);

module.exports = router;
