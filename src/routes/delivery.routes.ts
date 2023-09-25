import { Router } from "express";
import deliveryController from "../controllers/delivery.controller";
import { authenticate } from "../middleware/authenticate.middleware";
import { authorize } from "../middleware/authorize.middleware";
import { RoleEnumType } from "../entities/user.entity";
import { createDeliveryPriceCalculatorSchema, updateDeliveryPriceCalculatorSchema } from "../schemas/deliveryPriceCalculator.schema";
import { validate } from "../middleware/validateSchema.middleware";
import { createDeliverySchema } from "../schemas/delivery.schema";

const deliveryRouter = Router();

deliveryRouter.post("", validate(createDeliverySchema), deliveryController.create);

deliveryRouter.post(
	"/price",
	authenticate,
	authorize(RoleEnumType.ADMIN),
	validate(createDeliveryPriceCalculatorSchema),
	deliveryController.createPriceCalculator
);
deliveryRouter.put(
	"/price/:id",
	authenticate,
	authorize(RoleEnumType.ADMIN),
	validate(updateDeliveryPriceCalculatorSchema),
	deliveryController.updatePriceCalculator
);

export default deliveryRouter;
