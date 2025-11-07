const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, provider, beneficiaryAccount, beneficiarySwift } = req.body;

    const amountPattern = /^\d+(\.\d{1,2})?$/;
    const currencyPattern = /^[A-Z]{3}$/;
    const accountPattern = /^[A-Z0-9]{6,34}$/i;
    const swiftPattern = /^[A-Z0-9]{8,11}$/i;

    // Validate input
    if (!amountPattern.test(amount)) {
      return res.status(400).json({ error: "Invalid amount format" });
    }
    if (!currencyPattern.test(currency.toUpperCase())) {
      return res.status(400).json({ error: "Invalid currency format" });
    }
    if (!accountPattern.test(beneficiaryAccount)) {
      return res.status(400).json({ error: "Invalid beneficiary account number" });
    }
    if (!swiftPattern.test(beneficiarySwift.toUpperCase())) {
      return res.status(400).json({ error: "Invalid SWIFT/BIC code format" });
    }

    const payment = await Payment.create({
      user: req.user.id,
      amount,
      currency: currency.toUpperCase(),
      provider,
      beneficiaryAccount,
      beneficiarySwift: beneficiarySwift.toUpperCase(),
    });

    res.status(201).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json({ payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};
