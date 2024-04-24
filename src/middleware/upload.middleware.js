const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình multer để lưu file ở thư mục uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder:'Uploads',
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

// Khởi tạo middleware upload
const upload = multer({ storage: storage });

module.exports = upload;
