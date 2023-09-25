import { Router } from "express";
import deliveryRouter from "./delivery.routes";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/deliveries", deliveryRouter);

export default router;
