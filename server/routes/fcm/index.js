const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/auth.check");
const {
  updateFcmToken,
} = require("../../controllers/fcm/updateFcm.controller");
const {
  sendFcmNotification,
} = require("../../controllers/fcm/sendNotification.controller");

router.post("/updateFcmToken", requireAuth, updateFcmToken);
router.post("/sendFcmNotification", requireAuth, sendFcmNotification);

module.exports = router;
