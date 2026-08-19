import mongoose from "mongoose";
import Cryptr from "cryptr";
import dotenv from "dotenv";
dotenv.config();

const cryptr = new Cryptr(process.env.API_SECRET);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },
});
const UserModel = mongoose.model("User", userSchema);

await mongoose.connect(process.env.MONGODB_URL);
console.log("✅ Connected to MongoDB");

const email = "admin@nestro.com";
const password = "Admin@1234";
const name = "Nestro Admin";

// Check if already exists
const existing = await UserModel.findOne({ email });
if (existing) {
  // Just update role
  existing.role = "admin";
  existing.isVerified = true;
  await existing.save();
  console.log(`✅ User "${email}" updated → role: admin`);
} else {
  // Create new admin user
  const hashed = cryptr.encrypt(password);
  await UserModel.create({
    name,
    email,
    password: hashed,
    role: "admin",
    isVerified: true,
  });
  console.log(`✅ Admin user created!`);
  console.log(`   Email   : ${email}`);
  console.log(`   Password: ${password}`);
}

await mongoose.disconnect();
console.log("✅ Done!");
