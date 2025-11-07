const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // customer
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, default: 'SWIFT' },
  beneficiaryAccount: { type: String, required: true },
  beneficiarySwift: { type: String, required: true },
  status: { type: String, enum: ['pending','verified','submitted','failed'], default: 'pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // staff id
  verifiedAt: Date,
  submittedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Payment', paymentSchema);
