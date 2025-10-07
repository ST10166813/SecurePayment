const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, provider, recipientAccount, swiftCode } = req.body;

    // Updated regex patterns (safer & realistic)
    const amountPattern = /^\d+(\.\d{1,2})?$/;      // 2000 or 2000.50
    const currencyPattern = /^[A-Z]{3}$/;           // USD, ZAR, GBP
    const accountPattern = /^[0-9]{6,16}$/;         // 6-16 digits
    const swiftPattern = /^[A-Z0-9]{8,11}$/;        // Standard SWIFT format

    // Whitelist + validation
    if (
      !amountPattern.test(amount) ||
      !currencyPattern.test(currency.toUpperCase()) ||
      !accountPattern.test(recipientAccount) ||
      !swiftPattern.test(swiftCode.toUpperCase())
    ) {
      return res.status(400).json({ message: "Invalid input format" });
    }

    // Save payment
    const payment = await Payment.create({
      user: req.user.id,
      amount,
      currency: currency.toUpperCase(),
      provider,
      recipientAccount,
      swiftCode: swiftCode.toUpperCase()
    });

    res.status(201).json({ message: "Payment processed successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
