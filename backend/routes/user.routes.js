const express = require("express");
const {
  signup,
  login,
  updateUserInfo,
  bulk,
  getUser,
} = require("../controllers/user");
const { authMiddleware } = require("../middlewares/authMiddlewares");
const userRouter = express.Router();

userRouter
  .get("/bulk", bulk)
  .get("/getuser", authMiddleware, getUser)
  .post("/signup", signup)
  .post("/login", login)
  .put("/update", authMiddleware, updateUserInfo);

module.exports = userRouter;
