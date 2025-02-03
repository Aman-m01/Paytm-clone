const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
