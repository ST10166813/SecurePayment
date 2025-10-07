const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, default: "SWIFT" },
  recipientAccount: { type: String, required: true },
  swiftCode: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
