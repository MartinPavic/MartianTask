import { Types } from "ts-openapi";
import {
	documentLoginRequest,
	documentLogoutRequest,
	documentRefreshTokenRequest,
	documentRegisterRequest,
} from "./auth.documentation";
import { getReasonPhrase } from "http-status-codes";
import { documentGetCurrentUserRequest } from "./user.documentation";
import {
	documentCreateDeliveryPriceCalculatorRequest,
	documentCreateDeliveryRequest,
	documentUpdateDeliveryPriceCalculatorRequest,
} from "./delivery.documentation";
export const errorSchema = (statusCode: number) =>
	Types.Object({
		description: "Error description",
		properties: {
			status: Types.String({ description: "Request status (success, error)" }),
			message: Types.Integer({ description: "Error message" }),
		},
		example: { message: getReasonPhrase(statusCode), status: "error" },
	});

export function addPathsToOpenApi() {
	// AUTH
	documentLoginRequest();
	documentRegisterRequest();
	documentRefreshTokenRequest();
	documentLogoutRequest();

	// USERS
	documentGetCurrentUserRequest();

	// DELIVERIES
	documentCreateDeliveryRequest();
	documentCreateDeliveryPriceCalculatorRequest();
	documentUpdateDeliveryPriceCalculatorRequest();
}
