const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { requestPasswordReset, resetPassword } = require("../controllers/passwordResetController");
const { validateRegister, validateLogin } = require("../middleware/validators");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


module.exports = router;
