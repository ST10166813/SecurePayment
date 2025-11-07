const express = require("express");
const router = express.Router();

const { createPayment } = require("../controllers/paymentController");
const { validatePayment } = require("../middleware/validators");
const { requireAuth } = require("../middleware/authMiddleware");

// ✅ Protect Route Correctly
router.post("/create", requireAuth, validatePayment, createPayment);

module.exports = router;
