const express = require("express");
const router = express.Router();
const { requireAuth } = require("../../middleware/auth.check");
const photoUploadController = require("../../controllers/photoUpload/photoUpload.controller");
const multer = require("multer");
const upload = multer();

router.post("/image", requireAuth, upload.any(), photoUploadController);

module.exports = router;
