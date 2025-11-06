const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  actor: { type: String }, // username or account number
  action: { type: String, required: true },
  target: { type: String }, // payment id etc
  details: { type: Object },
  ip: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AuditLog', schema);
