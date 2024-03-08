const { body } = require("express-validator");

 const UserInput = [
  body("fullname").notEmpty().withMessage("First name is required"),
  body("phone").notEmpty().withMessage("Last name is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("email").trim().escape().notEmpty().withMessage("E-mail is required"),
];

 const UserUpdateInput = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
];

module.exports = {UserInput,UserUpdateInput};
