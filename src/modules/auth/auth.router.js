const { Router } = require("express");
const AuthController = require("./auth.controller.js");
const validationHandler = require("../../middleware/validator.middleware.js");
const { checkPermission } = require("../../middleware/auth.middleware.js");
const {
  AuthLoginInput,
  AuthRegisterInput,
  AuthChangePassInput,
} = require("./auth.validate.js");

const router = Router();

// Auth routes
router.post(
  "/login",
  validationHandler(AuthLoginInput),
  AuthController.loginUser
);
router.post(
  "/register",
  validationHandler(AuthRegisterInput),
  AuthController.createUser
);
router.get("/profile/:id", AuthController.profile);
router.put("/profile/:id", AuthController.updateprofile);
router.post(
  "/profile/password/:id",
  validationHandler(AuthChangePassInput),
  AuthController.updatePassword
);

module.exports = router;
