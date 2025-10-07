const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Routes
const authRoutes = require("./routes/auth");
const { protect } = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    timestamp: new Date()
  });
});

module.exports = app;