const { Router } = require("express");
const router = Router();

const OrderController = require("./order.controller.js");

router.post("/", OrderController.addOrder);

module.exports = router;
