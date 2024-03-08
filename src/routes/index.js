const { Router } = require("express");

// Import route from module
const authRouter = require("../modules/auth/auth.router.js");
const userRouter = require("../modules/user/user.router.js");
const productRouter = require("../modules/product/product.router.js");
const categoryRouter = require("../modules/category/category.router.js");
const authorRouter = require("../modules/author/author.router.js");
const publisherRouter = require("../modules/publisher/publisher.router.js");
const uploadRouter = require("../modules/upload/upload.router.js");

const routes = Router();
routes.use("/auth", authRouter);
routes.use("/user", userRouter);
routes.use("/product", productRouter);
routes.use("/category", categoryRouter);
routes.use("/author", authorRouter);
routes.use("/publisher", publisherRouter);
routes.use("/upload", uploadRouter);

module.exports = routes;
