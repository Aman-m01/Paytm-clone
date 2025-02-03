const express = require("express");
const { balance, transferBalance } = require("../controllers/account");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const accountRouter = express.Router();

accountRouter
  .get("/balance", authMiddleware, balance)
  .post("/transfer", authMiddleware, transferBalance);

module.exports = accountRouter;
