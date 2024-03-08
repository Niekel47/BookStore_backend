const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

const uploadImage = async (req, res) => {
  try {
    // Trả về đường dẫn của tệp đã tải lên
    res.json({ file: req.file, filePath: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {  uploadImage };
