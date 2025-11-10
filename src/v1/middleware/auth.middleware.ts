import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};
