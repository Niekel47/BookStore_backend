const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const User = require("../models/user.js");
config();

exports.genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      payload,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_expiresIn }
  );
  return access_token;
};

exports.genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_expiresIn }
  );
  return refresh_token;
};

exports.createJWT = (payload) => {
  let token = null;
  let key = process.env.JWT_SECRET;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log(error);
  }
  return token;
};

exports.verifyToken = (token) => {
  let decoded = null;
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};

exports.authenticateToken = (req, res, next) => {
  // Lấy token từ header 'Authorization'
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // Nếu không có token, trả về lỗi 401 (Unauthorized)
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Nếu token không hợp lệ, trả về lỗi 403 (Forbidden)
    }

    req.user = user; // Lưu thông tin người dùng vào request object
    next(); // Tiếp tục xử lý yêu cầu
  });
};