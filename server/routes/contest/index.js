const express = require("express");
const router = express.Router();
const createContestController = require("../../controllers/contests/createContest.controller");
const requireAuth = require("../../middleware/auth.check");

router.post("/create", requireAuth, createContestController);

module.exports = router;
