require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    console.log("✅ All users deleted successfully.");
  } catch (err) {
    console.error("❌ Error deleting users:", err);
  } finally {
    process.exit();
  }
})();
