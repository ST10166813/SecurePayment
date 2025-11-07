// backend/scripts/seedStaff.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs"); 
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

(async () => {
  await connectDB();
 const staffData = [
  {
    fullName: "Lucy Adams",
    email: "Lucy@gmail.com",
    password: await bcrypt.hash("password123", 10),
    role: "employee",
    idNumber: "STAFF001",
    accountNumber: "ACC001"   // ✅ Add this
  },
  {
    fullName: "John Smith",
    email: "John@gmail.com",
    password: await bcrypt.hash("password123", 10),
    role: "employee",
    idNumber: "STAFF002",
    accountNumber: "ACC002"   // ✅ Unique value
  }
];


  for (const s of staffData) {
    const exists = await User.findOne({ email: s.email });
    if (!exists) {
      const u = new User(s);
      await u.save();
      console.log('Created', s.email);
    } else {
      console.log('Exists', s.email);
    }
  }
  process.exit();
})();