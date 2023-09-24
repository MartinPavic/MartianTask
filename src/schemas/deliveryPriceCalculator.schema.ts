import { TypeOf, array, boolean, number, object } from "zod";

export const createDeliveryPriceCalculatorSchema = object({
	body: object({
		basePrice: number({
			required_error: "Base price is required",
		}),
		pricePerKm: number({
			required_error: "Price per KM is required",
		}),
		distancePriceIntervals: array(
			object({
				fromKm: number(),
				price: number(),
			})
			// Sort price intervals from highest km to lowest km
		).transform((value) => value.sort((a, b) => a.fromKm - b.fromKm)),
		pricePerAdditionalPackage: number({
			required_error: "Price per additional package is required",
		}),
	}),
});

export const updateDeliveryPriceCalculatorSchema = object({
	body: object({
		basePrice: number({
			required_error: "Base price is required",
		}),
		pricePerKm: number({
			required_error: "Price per KM is required",
		}),
		distancePriceIntervals: array(
			object({
				fromKm: number(),
				price: number(),
			})
			// Sort price intervals from highest km to lowest km
		).transform((value) => value.sort((a, b) => a.fromKm - b.fromKm)),
		pricePerAdditionalPackage: number({
			required_error: "Price per additional package is required",
		}),
		active: boolean(),
	}),
});

export type CreateDeliveryPriceCalculatorInput = TypeOf<typeof createDeliveryPriceCalculatorSchema>["body"];

export type UpdateDeliveryPriceCalculatorInput = TypeOf<typeof updateDeliveryPriceCalculatorSchema>["body"];
