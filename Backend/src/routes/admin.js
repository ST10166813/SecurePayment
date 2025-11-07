const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// ✅ Updated regex patterns
const amountPattern = /^\d+(\.\d{1,2})?$/;             // Amount: 200 or 200.50
const swiftPattern = /^[A-Z0-9]{8,11}$/i;             // SWIFT/BIC: 8–11 alphanumeric
const accountPattern = /^[A-Z0-9\- ]{6,34}$/i;        // Account: 6–34 chars, alphanumeric, spaces or dashes

// GET - list pending & verified payments
router.get('/payments', requireAuth, requireRole('employee'), async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('user', 'fullName') // <-- add user name
      .lean();

    res.json({ payments });
  } catch (err) {
    next(err);
  }
});

// POST - verify a payment (mark verified)
router.post('/payments/:id/verify', requireAuth, requireRole('employee'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // ✅ Validate account & SWIFT
    if (
      !accountPattern.test(payment.beneficiaryAccount.trim()) ||
      !swiftPattern.test(payment.beneficiarySwift.trim().toUpperCase())
    ) {
      return res.status(400).json({ error: 'Payee data invalid' });
    }

    payment.status = 'verified';
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = new Date();
    await payment.save();

    // ✅ Audit log
    await AuditLog.create({
      actor: req.user.email || req.user.id,
      action: 'verify_payment',
      target: payment._id,
      details: { paymentId: payment._id },
      ip: req.ip
    });

    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
});

// POST - submit verified payments to SWIFT (simulate)
router.post('/payments/submit', requireAuth, requireRole('employee'), async (req, res, next) => {
  try {
    const { paymentIds } = req.body;
    if (!Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({ error: 'No payments supplied' });
    }

    const results = [];
    for (const id of paymentIds) {
      const p = await Payment.findById(id).populate('user', 'fullName email');
      if (!p) { 
        results.push({ id, status: 'Not found' }); 
        continue; 
      }

      if (p.status === 'submitted') {
        results.push({ 
          id: p._id,
          customer: p.user?.fullName || 'Unknown',
          amount: p.amount,
          status: 'Already submitted ✅' 
        });
        continue;
      }

      if (p.status !== 'verified') { 
        results.push({ 
          id: p._id,
          customer: p.user?.fullName || 'Unknown',
          amount: p.amount,
          status: 'Not verified ❌' 
        });
        continue; 
      }

      // mark as submitted
      p.status = 'submitted';
      p.submittedAt = new Date();
      await p.save();

      // ✅ Audit log
      await AuditLog.create({
        actor: req.user.email || req.user.id,
        action: 'submit_to_swift',
        target: p._id,
        details: { paymentId: p._id },
        ip: req.ip
      });

      results.push({ 
        id: p._id,
        customer: p.user?.fullName || 'Unknown',
        amount: p.amount,
        status: 'Submitted ✅' 
      });
    }

    res.json({ results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
