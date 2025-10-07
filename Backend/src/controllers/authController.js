const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");

exports.register = async (req, res) => {
  try {
    const { fullName, idNumber, accountNumber, email, password } = req.body;

    // Whitelist inputs
    if (
      !validator.isAlpha(fullName.replace(/\s/g, ""), "en-US") ||
      !validator.isNumeric(idNumber) ||
      !validator.isNumeric(accountNumber) ||
      !validator.isEmail(email)
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const user = new User({ fullName, idNumber, accountNumber, email, password });
    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, accountNumber, password } = req.body;
    const user = await User.findOne({ email, accountNumber });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
