import { Schema, model, models, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone?: string;
}

const userSchema = new Schema<IUser>(
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
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;

