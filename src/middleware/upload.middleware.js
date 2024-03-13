const multer = require("multer");

// Cấu hình multer để lưu file ở thư mục uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Khởi tạo middleware upload
const upload = multer({ storage: storage });

module.exports = upload;
