import { Router } from "express";
import userController from "../controllers/user.controller";
import { authenticate } from "../middleware/authenticate.middleware";

const userRouter = Router();

userRouter.get("/current", authenticate, userController.getCurrentUser)

export default userRouter;
