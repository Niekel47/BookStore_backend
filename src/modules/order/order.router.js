const { Router } = require("express");
const router = Router();

const OrderController = require("./order.controller.js");

router.post("/", OrderController.addOrder);
router.get("/", OrderController.getAllOrder);
router.put("/:id", OrderController.updateOrder);
router.delete("/:id", OrderController.deleteOrder);
router.post("/delete-many", OrderController.deleteManyOrder);
router.get(
  "/order_wait/:user_id",

  OrderController.getOrderWait
);
router.get(
  "/order_ship/:user_id",

  OrderController.getOrderShip
);
router.get(
  "/order_complete/:user_id",

  OrderController.getOrderComplete
);
router.get(
  "/order_cancel/:user_id",

  OrderController.getOrderCancel
);
router.put(
  "/order_cancel_action/:order_id",

  OrderController.handleCancelOrder
);
router.put(
  "/order_confirm_action/:order_id",
  OrderController.handleUpdateConfirm
);

module.exports = router;
