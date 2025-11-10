import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request<unknown, unknown, IUser>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};
