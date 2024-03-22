const express = require("express");
const sequelize = require("./src/config/db.js");
const { config } = require("dotenv");
const routes = require("./src/routes/index.js");
const cors = require("cors");
const { expressjwt } = require("express-jwt");
// const configCors = require("./src/middleware/configcors.middleware.js")

const {
  errorHandler,
  responseSuccess,
} = require("./src/middleware/respone.middlware.js");
const path = require("path");

config();
const app = express();
// configCors(app)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(responseSuccess);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);
app.use("/api", routes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected!");
    await sequelize.sync({ alter: process.env.DB_ALTER !== "false" });
    console.log("✅ Database sync!");
    const port = process.env.PORT || 3001;
    app.listen(port, async () => {
      console.log(`
🚀 Server ready at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

startServer();
