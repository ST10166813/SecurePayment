const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const AuditLog = require('../models/AuditLog');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

// whitelist regexes
const amountPattern = /^\d+(\.\d{1,2})?$/;
const swiftPattern = /^[A-Z0-9]{8,11}$/;
const accountPattern = /^[0-9]{6,20}$/;

// GET - list pending & verified payments
router.get('/payments', requireAuth, requireRole('staff'), async (req, res, next) => {
  try {
    // optionally paginate and filter
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ payments });
  } catch (err) { next(err); }
});

// POST - verify a payment (mark verified)
router.post('/payments/:id/verify', requireAuth, requireRole('staff'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ error: 'Not found' });

    // Basic re-validate payee data server-side
    if (!accountPattern.test(payment.beneficiaryAccount) || !swiftPattern.test(payment.beneficiarySwift)) {
      return res.status(400).json({ error: 'Payee data invalid' });
    }

    payment.status = 'verified';
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = new Date();
    await payment.save();

    await AuditLog.create({ actor: req.user.email || req.user.id, action: 'verify_payment', target: payment._id, details: { paymentId: payment._id }, ip: req.ip });

    res.json({ success: true, payment });
  } catch (err) { next(err); }
});

// POST - submit verified payments to SWIFT (simulate)
router.post('/payments/submit', requireAuth, requireRole('staff'), async (req, res, next) => {
  try {
    // accept a list of payment IDs to submit
    const { paymentIds } = req.body;
    if (!Array.isArray(paymentIds) || paymentIds.length === 0) return res.status(400).json({ error: 'No payments supplied' });

    // Re-validate each and mark submitted (simulate third-party call)
    const results = [];
    for (const id of paymentIds) {
      const p = await Payment.findById(id);
      if (!p) { results.push({ id, status: 'not_found' }); continue; }
      if (p.status !== 'verified') { results.push({ id, status: 'not_verified' }); continue; }

      // Simulate call to SWIFT provider (you can add provider API here)
      // e.g., const resp = await callSwift(p); if resp.ok -> continue
      p.status = 'submitted';
      p.submittedAt = new Date();
      await p.save();
      await AuditLog.create({ actor: req.user.email || req.user.id, action: 'submit_to_swift', target: p._id, details: { paymentId: p._id }, ip: req.ip });
      results.push({ id, status: 'submitted' });
    }

    res.json({ results });
  } catch (err) { next(err); }
});

module.exports = router;