import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin.model";
import jwt from "jsonwebtoken";

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export const login = async (
  req: Request<unknown, unknown, LoginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
      return;
    }

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Find admin and include password
    const admin = await Admin.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Check password
    if (!admin.password) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRE as string | number }
    );

    const response: AuthResponse = {
      token,
      user: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request & { user?: { id: string; email: string; role: string } },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = await Admin.findById(req.user?.id);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
