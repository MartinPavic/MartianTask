import { Column, Entity } from "typeorm";
import Model from "./model.entity";

// We assume price is in euro (€)
@Entity("delivery_price_calculator")
export class DeliveryPriceCalculator extends Model {
	@Column()
	basePrice: number;

	@Column()
	pricePerKm: number;

	@Column("jsonb")
	distancePriceIntervals: {
		fromKm: number;
		price: number;
	}[];

	@Column()
	pricePerAdditionalPackage: number;

	// One price calculator can be active at a time
	// Active one will be cached in redis
	@Column()
	active: boolean;
}
