import { Schema, model, models, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin {
  name: string;
  email: string;
  password: string;
  role: "admin" | "superadmin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only if password is not already hashed)
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
  if (this.password.startsWith("$2")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin: Model<IAdmin> =
  models.Admin || model<IAdmin>("Admin", adminSchema);

export default Admin;
