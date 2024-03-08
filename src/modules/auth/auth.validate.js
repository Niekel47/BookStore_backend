const { body } = require("express-validator");

const AuthRegisterInput = [
  body("fullname").notEmpty().withMessage("First name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric")
    .isLength({ min: 10, max: 11 })
    .withMessage("Phone number must be between 10 and 11 digits"),
];

 const AuthLoginInput = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("E-mail is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

 const AuthChangePassInput = [
  body("password").notEmpty().withMessage("Password is required"),
  body("new_password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = {AuthRegisterInput,AuthLoginInput,AuthChangePassInput}
