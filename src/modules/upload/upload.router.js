const express = require("express");
const { uploadImageController } = require("./upload.controller.js");

const { upload } = require("./upload.service.js");

const router = express.Router();

// Định nghĩa route để xử lý việc upload ảnh
router.post("/", upload.single("file"), uploadImageController);

module.exports = router;
