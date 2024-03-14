const { Router } = require("express");
const router = Router();
const UserController = require("./user.controller.js");
const validationHandler = require("../../middleware/validator.middleware.js");
const UserInput = require("./user.validate.js");

//User
router.get("/", UserController.getAllUsers);
// router.get("/", UserController.list);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);
router.post("/delete-many", UserController.deleteManyUsers);
router.post("/register", UserController.Register);

// router.delete("/", deleteUsers);

module.exports = router;
