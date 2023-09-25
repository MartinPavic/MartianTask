import config from "config";
import { Delivery } from "../entities/delivery.entity";
import { DeliveryPriceCalculator } from "../entities/deliveryPriceCalculator.entity";
import logger from "../utils/logger";

export default class DeliveryPriceCalculatorService {
	static calculateDeliveryPrice(delivery: Delivery, deliveryPriceCalculator: DeliveryPriceCalculator): number {
		const isWeekend = new Date().getDay() % 6 === 0;
		// Sort delivery distance intervals from highest fromKm to lowest, then match the first one that is lower than delivery distance
		const sortedPriceIntervals = [...deliveryPriceCalculator.distancePriceIntervals].sort(
			(a, b) => b.fromKm - a.fromKm
		);
		const pricePerKm = sortedPriceIntervals.find((value) => value.fromKm <= delivery.deliveryDistance) ?? {
			fromKm: 0,
			price: config.get<number>("defaultPricePerKm"),
		};
		logger.debug(
			`[DeliveryPriceCalculatorService] Delivery distance ${delivery.deliveryDistance} matched delivery price interval, fromKm ${pricePerKm.fromKm} price ${pricePerKm.price}`
		);
		const priceForPackages = (delivery.numberOfPackages - 1) * deliveryPriceCalculator.pricePerAdditionalPackage;
		const price =
			deliveryPriceCalculator.basePrice + pricePerKm.price * delivery.deliveryDistance + priceForPackages;
		const finalPrice = isWeekend ? price * 1.1 : price;
		logger.info(`[DeliveryPriceCalculatorService] Delivery price is ${finalPrice}`);
		return finalPrice;
	}
}
