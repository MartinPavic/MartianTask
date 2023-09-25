import { Types } from "ts-openapi";
import { openApiInstance } from "../openapi";
import { errorSchema } from ".";

// CREATE DELIVERY
export function documentCreateDeliveryRequest() {
	const createDeliveryRequestSchema = Types.Object({
		description: "Create delivery request",
		properties: {
			firstName: Types.String({
				description: "Name",
			}),
			lastName: Types.String({
				description: "Name",
			}),
			email: Types.String({
				description: "Email",
			}),
			phoneNumber: Types.String({
				description: "Phone number",
			}),
			deliveryDate: Types.Date({
				description: "Delivery date",
			}),
			numberOfPackages: Types.Number({
				description: "Number of packages",
			}),
			deliveryDistance: Types.Number({
				description: "Delivery distance",
			}),
		},
	});
	const createDeliveryResponseSchema = Types.Object({
		description: "Create delivery response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					newDelivery: Types.Object({
						properties: {
							firstName: Types.String({
								description: "Name",
							}),
							lastName: Types.String({
								description: "Name",
							}),
							email: Types.String({
								description: "Email",
							}),
							phoneNumber: Types.String({
								description: "Phone number",
							}),
							deliveryDate: Types.Date({
								description: "Delivery date",
							}),
							numberOfPackages: Types.Number({
								description: "Number of packages",
							}),
							deliveryDistance: Types.Number({
								description: "Delivery distance",
							}),
							id: Types.Uuid({
								description: "Delivery ID",
							}),
							createdAt: Types.Date({
								description: "Delivery creation date",
							}),
							updatedAt: Types.Date({
								description: "Last updated at",
							}),
						},
					}),
					price: Types.Number({
						description: "Delivery price",
					}),
				},
			}),
		},
	});
	openApiInstance.addPath(
		"/api/deliveries",
		{
			post: {
				description: "Create new delivery",
				summary: "Create delivery",
				operationId: "createDelivery",
				responses: {
					201: openApiInstance.declareSchema("Success", createDeliveryResponseSchema),
					400: openApiInstance.declareSchema("Bad request", errorSchema(400)),
					401: openApiInstance.declareSchema("Unauthorized", errorSchema(401)),
					404: openApiInstance.declareSchema("Delivery price calculator not found", errorSchema(404)),
				},
				tags: ["Deliveries"],
				requestSchema: {
					body: createDeliveryRequestSchema,
				},
				security: [{ cookieSecurity: [] }],
			},
		},
		true
	);
}

// CREATE DELIVERY PRICE CALCULATOR
export function documentCreateDeliveryPriceCalculatorRequest() {
	const createDeliveryPriceCalculatorRequestSchema = Types.Object({
		description: "Create delivery price calculator request",
		properties: {
			basePrice: Types.Number({
				description: "Base price",
			}),
			pricePerKm: Types.Number({
				description: "Price per km",
			}),
			distancePriceIntervals: Types.Array({
				arrayType: Types.Object({
					description: "Start km, price",
					properties: {
						fromKm: Types.Number({
							description: "Starting km from which this price is applied",
						}),
						price: Types.Number({
							description: "Price per km applied",
						}),
					},
				}),
			}),
			pricePerAdditionalPackage: Types.Number({
				description: "Price for additional packages (any more than 1)",
			}),
		},
	});
	const createDeliveryPriceCalculatorResponseSchema = Types.Object({
		description: "Create delivery price calculator response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					newPriceCalculator: Types.Object({
						properties: {
							basePrice: Types.Number({
								description: "Base price",
							}),
							pricePerKm: Types.Number({
								description: "Price per km",
							}),
							distancePriceIntervals: Types.Array({
								arrayType: Types.Object({
									description: "Start km, price",
									properties: {
										fromKm: Types.Number({
											description: "Starting km from which this price is applied",
										}),
										price: Types.Number({
											description: "Price per km applied",
										}),
									},
								}),
							}),
							pricePerAdditionalPackage: Types.Number({
								description: "Price for additional packages (any more than 1)",
							}),
							active: Types.Boolean({
								description: "Is price calculator currently active",
							}),
							id: Types.Uuid({
								description: "Delivery price calculator ID",
							}),
							createdAt: Types.Date({
								description: "Delivery price calculator creation date",
							}),
							updatedAt: Types.Date({
								description: "Last updated at",
							}),
						},
					}),
				},
			}),
		},
	});
	openApiInstance.addPath(
		"/api/deliveries/price",
		{
			post: {
				description: "Create new delivery price calculator",
				summary: "Create delivery price calculator",
				operationId: "createDeliveryPriceCalculator",
				responses: {
					201: openApiInstance.declareSchema("Success", createDeliveryPriceCalculatorResponseSchema),
					400: openApiInstance.declareSchema("Bad request", errorSchema(400)),
					401: openApiInstance.declareSchema("Unauthorized", errorSchema(401)),
				},
				tags: ["Deliveries"],
				requestSchema: {
					body: createDeliveryPriceCalculatorRequestSchema,
				},
				security: [{ cookieSecurity: [] }],
			},
		},
		true
	);
}

// UPDATE DELIVERY PRICE CALCULATOR
export function documentUpdateDeliveryPriceCalculatorRequest() {
	const updateDeliveryPriceCalculatorRequestSchema = Types.Object({
		description: "Update delivery price calculator request",
		properties: {
			basePrice: Types.Number({
				description: "Base price",
				required: false,
			}),
			pricePerKm: Types.Number({
				description: "Price per km",
				required: false,
			}),
			distancePriceIntervals: Types.Array({
				arrayType: Types.Object({
					description: "Start km, price",
					properties: {
						fromKm: Types.Number({
							description: "Starting km from which this price is applied",
						}),
						price: Types.Number({
							description: "Price per km applied",
						}),
					},
				}),
				required: false,
			}),
			pricePerAdditionalPackage: Types.Number({
				description: "Price for additional packages (any more than 1)",
				required: false,
			}),
			active: Types.Boolean({
				description: "Is price calculator currently active",
			}),
		},
	});
	const updateDeliveryPriceCalculatorResponseSchema = Types.Object({
		description: "Update delivery price calculator response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					priceCalculator: Types.Object({
						properties: {
							basePrice: Types.Number({
								description: "Base price",
							}),
							pricePerKm: Types.Number({
								description: "Price per km",
							}),
							distancePriceIntervals: Types.Array({
								arrayType: Types.Object({
									description: "Start km, price",
									properties: {
										fromKm: Types.Number({
											description: "Starting km from which this price is applied",
										}),
										price: Types.Number({
											description: "Price per km applied",
										}),
									},
								}),
							}),
							pricePerAdditionalPackage: Types.Number({
								description: "Price for additional packages (any more than 1)",
							}),
							active: Types.Boolean({
								description: "Is price calculator currently active",
							}),
							id: Types.Uuid({
								description: "Delivery price calculator ID",
							}),
							createdAt: Types.Date({
								description: "Delivery price calculator creation date",
							}),
							updatedAt: Types.Date({
								description: "Last updated at",
							}),
						},
					}),
				},
			}),
		},
	});
	openApiInstance.addPath(
		"/api/deliveries/price/:id",
		{
			put: {
				description: "Update new delivery price calculator",
				summary: "Update delivery price calculator",
				operationId: "updateDeliveryPriceCalculator",
				responses: {
					200: openApiInstance.declareSchema("Success", updateDeliveryPriceCalculatorResponseSchema),
					400: openApiInstance.declareSchema("Bad request", errorSchema(400)),
					401: openApiInstance.declareSchema("Unauthorized", errorSchema(401)),
				},
				tags: ["Deliveries"],
				requestSchema: {
					params: {
						id: Types.Uuid({
							description: "Delivery price calculator ID",
							required: true,
						}),
					},
					body: updateDeliveryPriceCalculatorRequestSchema,
				},
				security: [{ cookieSecurity: [] }],
			},
		},
		true
	);
}
