const { body } = require("express-validator");

exports.validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password")
    .trim()
    .matches(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/)
    .withMessage("Weak password"),
];

exports.validateLogin = [
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password").trim().notEmpty().withMessage("Password required"),
];

exports.validatePayment = [
  // Sanitize and validate payment fields
  body("amount")
    .trim()
    .isFloat({ min: 1 }).withMessage("Amount must be a positive number"),

  body("currency")
    .trim()
    .escape()
    .isLength({ min: 3, max: 3 }).withMessage("Currency must be 3 letters"),

  body("provider")
    .trim()
    .escape()
    .notEmpty().withMessage("Provider required"),

  body("recipientAccount")
    .trim()
    .escape()
    .isLength({ min: 6 }).withMessage("Account number invalid"),

  body("swiftCode")
    .trim()
    .escape()
    .matches(/^[A-Z0-9]{8,11}$/).withMessage("Invalid SWIFT code"),
];

