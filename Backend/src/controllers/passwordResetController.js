const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendResetEmail } = require("../utils/email");

const RESET_BYTES = parseInt(process.env.RESET_TOKEN_BYTES || "32", 10);
const RESET_EXP_MIN = parseInt(process.env.RESET_TOKEN_EXPIRY_MINUTES || "30", 10);
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

// Request reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "If an account exists, a reset link has been sent." });

    // Generate raw token
    const rawToken = crypto.randomBytes(RESET_BYTES).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpires = Date.now() + RESET_EXP_MIN * 60 * 1000;
    await user.save();

    // Send email
    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
    await sendResetEmail(email, user.name, resetLink);

    return res.json({ message: "If an account exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (tokenHash !== user.resetPasswordToken)
      return res.status(400).json({ message: "Invalid token" });

    // ✅ Let Mongoose handle hashing
    user.password = newPassword;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
