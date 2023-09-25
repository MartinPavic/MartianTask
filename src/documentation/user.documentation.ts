// GET CURRENT USER

import { Types } from "ts-openapi";
import { RoleEnumType } from "../entities/user.entity";
import { openApiInstance } from "../openapi";
import { errorSchema } from ".";

export function documentGetCurrentUserRequest() {
	const getCurrentUserResponseSchema = Types.Object({
		description: "Get current user response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					user: Types.Object({
						properties: {
							name: Types.String({
								description: "Name",
							}),
							email: Types.String({
								description: "Email",
							}),
							role: Types.StringEnum({
								values: Object.values(RoleEnumType),
								description: "User's role (user, admin)",
							}),
							id: Types.Uuid({
								description: "User's ID",
							}),
							createdAt: Types.Date({
								description: "User's creation date",
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
		"/api/users/current",
		{
			get: {
				description: "Get current user data",
				summary: "Current user",
				operationId: "currentUser",
				responses: {
					200: openApiInstance.declareSchema("Success", getCurrentUserResponseSchema),
					401: openApiInstance.declareSchema("Unauthorized", errorSchema(401)),
				},
				tags: ["Users"],
				security: [{ cookieSecurity: [] }],
			},
		},
		true
	);
}
