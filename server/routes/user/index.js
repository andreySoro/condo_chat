const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/auth.check");
const deleteUser = require("../../controllers/user/deleteUser.controller");

router.post("/delete", requireAuth, deleteUser);

module.exports = router;
