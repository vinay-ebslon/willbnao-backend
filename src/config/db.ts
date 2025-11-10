import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database connection error";
    console.error("❌ MongoDB Connection Failed:", message);
    process.exit(1);
  }
};

export default connectDB;

