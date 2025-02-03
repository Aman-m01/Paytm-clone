const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const accountRouter = require("./routes/account.routes");

const app = express();
dotenv.config();

// middlewares
app.use(express.json());
app.use(cors());






app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.get("/", (req, res) => {
  res.send("server is running");
});

module.exports = app;
