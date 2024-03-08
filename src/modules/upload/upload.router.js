const express = require("express");
const { uploadImageController } = require("./upload.controller.js");
// const { upload } = require("./upload.service.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// Định nghĩa route để xử lý việc upload ảnh
router.post("/", upload.single("file"), uploadImageController);

module.exports = router;
