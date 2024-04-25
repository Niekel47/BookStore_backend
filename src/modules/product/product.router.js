const { Router } = require("express");
const router = Router();
const ProductController = require("./product.controller.js");
const upload = require("../../middleware/upload.middleware.js");

// Product
router.get("/", ProductController.getAllProducts);
router.get("/search", ProductController.getProductSearch);
router.get("/:id", ProductController.getProductById);
router.post("/", upload.single("image"), ProductController.createProduct);
router.put("/:id", upload.single("image"), ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);
router.post("/delete-many", ProductController.deleteManyProduct);


module.exports = router;
