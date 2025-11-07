const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

exports.register = async (req, res) => {
 try {
    const { fullName, idNumber, accountNumber, email, password } = req.body;

    const strongPasswordRegex = /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/;

    // ✅ Validate name
    if (!validator.isAlpha(fullName.replace(/\s/g, ""))) {
      return res.status(400).json({ message: "Full name must contain only letters" });
    }

    // ✅ Validate ID number & account number
    if (!validator.isNumeric(idNumber) || !validator.isNumeric(accountNumber)) {
      return res.status(400).json({ message: "ID and Account number must be numeric" });
    }

    // ✅ Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Strong password enforcement
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars with uppercase, lowercase, number, and special character",
      });
    }

    // ✅ Store secure password (Model handles hashing)
    const user = new User({ fullName, idNumber, accountNumber, email, password });
    await user.save();

    res.status(201).json({ message: "Registration successful" });

 } catch (error) {
    console.error(error);
   console.log("Registration error:", error);
res.status(500).json({ message: error.message });
 }
};
exports.login = async (req, res) => {
  try {
    const { email, accountNumber, password } = req.body;

    if (!email || !accountNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Check account number AFTER verifying password
    if (user.accountNumber !== accountNumber) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Create JWT with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        accountNumber: user.accountNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};