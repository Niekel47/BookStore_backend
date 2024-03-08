const { Router } = require("express"); ;
const router = Router();
const CategoryController = require("./category.controller.js"); ;

router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getAllCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);
router.post("/delete-many", CategoryController.deleteManyCategory);

module.exports = router;
