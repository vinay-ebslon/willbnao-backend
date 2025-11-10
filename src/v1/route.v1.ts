import { Router } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
