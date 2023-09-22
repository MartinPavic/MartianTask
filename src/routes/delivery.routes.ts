import { Router } from "express";

const deliveryRouter = Router();

deliveryRouter.get("/price", calculatePrice)
deliveryRouter.post("/price", createDeliveryPriceCalc)
deliveryRouter.put("/price", updateDeliveryPriceCalc)

deliveryRouter.post("", createDelivery)

export default deliveryRouter;
