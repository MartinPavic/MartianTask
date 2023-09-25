import { Types } from "ts-openapi";
import { documentLoginRequest } from "./auth.documentation";

export const errorSchema = Types.Object({
	description: "Error description",
	properties: {
		status: Types.String({ description: "Request status (success, error)" }),
		message: Types.Integer({ description: "Error message" }),
	},
	example: { message: "Bad request", status: "error" }
});

export function addPathsToOpenApi() {
	documentLoginRequest();
}