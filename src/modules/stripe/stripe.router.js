const express = require("express");
const payment_route = express();

const bodyParser = require("body-parser");
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended: false }));

const paymentController = require("../stripe/stripe.controller");

payment_route.post("/create-customer", paymentController.createCustomer);
payment_route.post("/add-card", paymentController.addNewCard);
payment_route.post("/create-charges", paymentController.createCharges);
payment_route.post("/create-checkout-session",paymentController.createCheckout);

module.exports = payment_route;
