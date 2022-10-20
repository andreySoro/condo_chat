const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/auth.check");
const { photoUpload, profilePhotoUpload } = require("../../controllers/photoUpload/photoUpload.controller");
const multer = require("multer");
const upload = multer();

router.post("/image", requireAuth, upload.any(), photoUpload);
router.post("/image/profile", requireAuth, upload.any(), profilePhotoUpload);

module.exports = router;
