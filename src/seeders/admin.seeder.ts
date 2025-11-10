import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../v1/models/admin.model";
import { encryptPassword } from "../helpers/bcrypt";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

export const adminSeeder = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Default admin credentials (change these in production)
    const defaultPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const encryptedPassword = await encryptPassword(defaultPassword);

    const adminData = {
      name: process.env.ADMIN_NAME || "Admin User",
      email: process.env.ADMIN_EMAIL || "admin@willbanao.com",
      password: encryptedPassword,
      role: "admin" as const,
    };

    // Check if admin already exists
    const adminExist = await Admin.findOne({
      $or: [
        { email: adminData.email },
        { role: "admin" },
        { role: "superadmin" },
      ],
    })
      .lean()
      .exec();

    if (adminExist) {
      console.log("⚠️  Admin user already exists");
      console.log("📧 Email:", adminExist.email);
      console.log("👤 Name:", adminExist.name);
      console.log("🔑 Role:", adminExist.role);
      console.log(
        "   To create a new admin, use a different email or delete the existing one."
      );
      await mongoose.disconnect();
      return "Admin already exists";
    }

    // Create new admin user
    const newAdmin = await new Admin({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      role: adminData.role,
    }).save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", newAdmin.email);
    console.log("👤 Name:", newAdmin.name);
    console.log("🔑 Role:", newAdmin.role);
    console.log("⚠️  Please change the default password after first login!");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    return "Admin created successfully";
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    await mongoose.disconnect();
    throw error; // Propagate error for better handling
  }
};

// Run seeder if called directly
if (require.main === module) {
  adminSeeder()
    .then((message) => {
      console.log(message);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeder failed:", error);
      process.exit(1);
    });
}
