require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

(async () => {
  try {
    await connectDB(); // Ensure DB is connected
    console.log("✅ Database connected");

    const staffData = [
  {
    fullName: "LUCY CHEN",
    email: "Lucy@gmail.com",
    password: "password123",  // no bcrypt here
    role: "employee",
    idNumber: "STAFF001",
    accountNumber: "ACC001"
  },
  {
    fullName: "TIM BRADFORD",
    email: "Tim@gmail.com",
    password: "password123",
    role: "employee",
    idNumber: "STAFF002",
    accountNumber: "ACC002"
  }
];

    for (const staff of staffData) {
      const exists = await User.findOne({ email: staff.email });
      if (!exists) {
        await User.create(staff);
        console.log(`🟢 Created: ${staff.email}`);
      } else {
        console.log(`🟡 Already exists: ${staff.email}`);
      }
    }

    console.log("✅ Staff seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding staff:", err.message);
    process.exit(1);
  }
})();
