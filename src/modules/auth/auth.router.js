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
router.get("/profile", AuthController.profile);
router.put("/profile", AuthController.updateprofile);
router.post(
  "/profile/changepassword",
  // validationHandler(AuthChangePassInput),
  AuthController.updatePassword
);
router.get("/authentication", AuthController.handleAuth);

module.exports = router;
