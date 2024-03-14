const { body } = require("express-validator");

const UserInput = [
  body("fullname").notEmpty().withMessage("Full name is required"),
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

const UserUpdateInput = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
];

module.exports = { UserInput, UserUpdateInput };
