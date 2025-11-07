require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const https = require("https");
const path = require('path');
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/admin");

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Load SSL Certificate Files
// Load SSL certificate
const key = fs.readFileSync(path.join(__dirname, '../ssl/privatekey.pem'));
const cert = fs.readFileSync(path.join(__dirname, '../ssl/certificate.pem'));

const httpsOptions = { key, cert };

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server running at https://localhost:${PORT}`);
});