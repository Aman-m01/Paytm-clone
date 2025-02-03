const express = require('express');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const Account = require('../models/account.models');

// Get the balance
exports.balance = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      balance: account.balance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// transfer balance
exports.transferBalance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;

    if (amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Don't allow transfer to oneself
    if (to === req.userId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cannot transfer to yourself!" });
    }

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid account" });
    }

    
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

 
    await session.commitTransaction();
    res.json({ message: "Transfer successful" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();  // end the session
  }
};