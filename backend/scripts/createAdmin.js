require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.error(
    'Usage: node scripts/createAdmin.js "Admin Name" admin@example.com StrongPassword123',
  );
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`Admin with email ${email} already exists.`);
      process.exit(0);
    }

    await Admin.create({ name, email, password });
    console.log(`Admin account created for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  }
})();
