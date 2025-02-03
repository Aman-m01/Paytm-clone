const express = require("express");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const Account = require("../models/account.models");
const { authMiddleware } = require("../middlewares/authMiddlewares");

// for signup
exports.signup = async (req, res) => {
  try {
    const validateData = userSchema.parse(req.body);

    // Check if username already exists
    const existingUser = await User.findOne({ userName: req.body.userName });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const { userName, password, firstName, lastName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      userName,
      firstName,
      lastName,
      password: hashedPassword,
    });

    const userId = newUser._id;

    const initialBalance = parseInt(Math.random() * 50000) + 1;
    await Account.create({
      userId,
      balance: initialBalance,
    });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User created successfully",
      token: token,
      userId: userId,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "An error occurred during signup" });
  }
};

// for login/signin
exports.login = async (req, res) => {
  try {
    const validateData = userSchema
      .pick({ userName: true, password: true })
      .parse(req.body);

    // Check if user exists
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

// update the userInfo
exports.updateUserInfo = async (req, res) => {
  try {
    const updateUserSchema = userSchema
      .pick({ firstName: true, lastName: true, password: true })
      .partial();
    const validateData = updateUserSchema.parse(req.body);

    const { firstName, lastName, password } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate(req.userId, updateData, { new: true });

    res
      .status(200)
      .json({ message: "User info updated successfully", userId: req.userId });
  } catch (error) {
    console.error("Error during updateUserInfo:", error);
    res.status(500).json({ error: "An error occurred during updateUserInfo" });
  }
};

// for getting users with the filter query
exports.bulk = async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
  
    res.json({
      user: users.map((user) => ({
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
    
  } catch (error) {
    console.error("Error during /bulk request:", error.message);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
};


// current userInfo
exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        username: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Error during /getUser request:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user details" });
  }
};
