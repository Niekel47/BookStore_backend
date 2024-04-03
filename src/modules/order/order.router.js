const { Router } = require("express");
const router = Router();

const OrderController = require("./order.controller.js");

router.post("/", OrderController.addOrder);
router.get("/", OrderController.getAllOrder);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);
router.post("/delete-many", OrderController.deleteManyOrder);

module.exports = router;
