const { Router } = require("express");
const  RateController  = require("./rate.controller");
const router = Router();


router.get(
  "/rate/:product_id/:user_id",

  RateController.getProductRate
);
router.post("/", RateController.handleRate);

module.exports = router;
