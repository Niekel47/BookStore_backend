const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const User = require("../models/user.js");
config();

exports.genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN,
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

exports.checkPermission = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        message: "Ban chua dang nhap!",
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN,
      process.env.REFRESH_TOKEN
    );
    const user = await User.findbyID(decoded._id);
    if (!user) {
      return res.status(403).json({
        message: "Token loi!",
      });
    }
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Ban khong phai admin!",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
