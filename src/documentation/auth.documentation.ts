import { errorSchema } from ".";
import { openApiInstance } from "../openapi";
import { Types } from "ts-openapi";


// LOGIN
export function documentLoginRequest() {
	const loginRequestSchema = {
		email: Types.String({
			description: "Email",
			required: true,
			example: "example@gmail.com"
		}),
		password: Types.String({
			description: "Password",
			maxLength: 32,
			minLength: 8,
			required: true
		})
	}
	const loginResponseSchema = Types.Object({
		description: "Login response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			accessToken: Types.String({
				description: "Access token to use for subsequent requests",
				example: ""
			})
		}	
	})
	openApiInstance.addPath(
		"/login",
		{
			post: {
				description: "Login",
				summary: "Login to api with email and password, recieve access token",
				operationId: "login",
				responses: {
					200: openApiInstance.declareSchema("Login success", loginResponseSchema),
					400: openApiInstance.declareSchema("Invalid email or password", errorSchema)
				},
				tags: ["Auth"],
				requestSchema: {
					body: Types.Object({
						properties: loginRequestSchema
				})
				}
			},
		},
		true
	);
}


// REGISTER

// REFRESH TOKEN

// LOGOUT
