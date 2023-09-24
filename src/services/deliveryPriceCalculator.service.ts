import { Delivery } from "../entities/delivery.entity";
import { DeliveryPriceCalculator } from "../entities/deliveryPriceCalculator.entity";

export default class DeliveryPriceCalculatorService {
	static calculateDeliveryPrice(delivery: Delivery, deliveryPriceCalculator: DeliveryPriceCalculator): number {
		const isWeekend = new Date().getDay() % 6 === 0;
		const pricePerKm = deliveryPriceCalculator.distancePriceIntervals.findIndex(
			(value) => value.fromKm < delivery.deliveryDistance
		);
		const priceForPackages = (delivery.numberOfPackages - 1) * deliveryPriceCalculator.pricePerAdditionalPackage;
		const price = deliveryPriceCalculator.basePrice + pricePerKm * delivery.deliveryDistance + priceForPackages;
		return isWeekend ? price * 1.1 : price;
	}
}
