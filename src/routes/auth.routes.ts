import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validate } from "../middleware/validateSchema.middleware";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { authenticate } from "../middleware/authenticate.middleware";

const authRouter = Router();

authRouter.post("/login", validate(loginUserSchema), authController.login);
authRouter.post("/register", validate(createUserSchema), authController.register);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.post("/refreshtoken", authController.refreshToken);

export default authRouter;
