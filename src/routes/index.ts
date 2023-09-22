import express, { Router } from "express";
import cors from "../middleware/cors.middleware";
import helmet from "helmet";
import deliveryRouter from "./delivery.routes";
import userRouter from "./user.routes";
import authRouter from "./auth.routes";

const router = Router();

router.use(express.json());
router.use(cors);
router.use(helmet());

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/deliveries", deliveryRouter);

export default router;
