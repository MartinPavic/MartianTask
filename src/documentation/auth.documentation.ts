import { errorSchema } from ".";
import { RoleEnumType } from "../entities/user.entity";
import { openApiInstance } from "../openapi";
import { Types } from "ts-openapi";

// LOGIN
export function documentLoginRequest() {
	const loginRequestSchema = {
		email: Types.String({
			description: "Email",
			required: true,
			example: "example@gmail.com",
		}),
		password: Types.String({
			description: "Password",
			maxLength: 32,
			minLength: 8,
			required: true,
		}),
	};
	const loginResponseSchema = Types.Object({
		description: "Login response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					accessToken: Types.String({
						description: "Access token to use for subsequent requests",
						example: `{
							"status": "success",
							"data": {
								"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjA4N2Q1ZS0yYWU4LTRjYmMtYjE2Ny1mMWI1MzNiNzg5M2IiLCJpYXQiOjE2OTU2NjUyMjgsImV4cCI6MTY5NTY2NjEyOH0.Z0m6R8fFv2VUfQs2LeWL_UzNx27YR72-97FgqN4bdCw"
							}
						}`,
					}),
				},
			}),
		},
	});
	openApiInstance.addPath(
		"/api/auth/login",
		{
			post: {
				description: "Login to api with email and password, recieve access token",
				summary: "Login",
				operationId: "login",
				responses: {
					200: openApiInstance.declareSchema("Login success", loginResponseSchema),
					400: openApiInstance.declareSchema("Invalid email or password", errorSchema(400)),
				},
				tags: ["Auth"],
				requestSchema: {
					body: Types.Object({
						properties: loginRequestSchema,
						description: "Email and password",
					}),
				},
			},
		},
		true
	);
}

// REGISTER
export function documentRegisterRequest() {
	const registerRequestSchema = {
		name: Types.String({
			description: "Name",
			required: true,
		}),
		email: Types.String({
			description: "Email",
			required: true,
			example: "example@gmail.com",
		}),
		password: Types.String({
			description: "Password",
			maxLength: 32,
			minLength: 8,
			required: true,
		}),
		passwordConfirm: Types.String({
			description: "Confirm password",
			maxLength: 32,
			minLength: 8,
			required: true,
		}),
		role: Types.StringEnum({
			values: Object.values(RoleEnumType),
			default: RoleEnumType.ADMIN,
			description: "User's role (user, admin)",
			required: false,
		}),
	};
	const registerResponseSchema = Types.Object({
		description: "register response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					newUser: Types.Object({
						properties: {
							name: Types.String({
								description: "Name",
							}),
							email: Types.String({
								description: "Email",
							}),
							password: Types.String({
								description: "Password",
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
		"/api/auth/register",
		{
			post: {
				description: "Register to API with your name, email and password",
				summary: "Register",
				operationId: "register",
				responses: {
					200: openApiInstance.declareSchema("Register success", registerResponseSchema),
					400: openApiInstance.declareSchema(
						"Invalid params or user with that email already exists",
						errorSchema(400)
					),
				},
				tags: ["Auth"],
				requestSchema: {
					body: Types.Object({
						properties: registerRequestSchema,
						description: "Name, email, password, confirm password and optional role",
					}),
				},
			},
		},
		true
	);
}

// REFRESH TOKEN
export function documentRefreshTokenRequest() {
	const refreshTokenResponseSchema = Types.Object({
		description: "Refresh token response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
			data: Types.Object({
				properties: {
					accessToken: Types.String({
						description: "Access token to use for subsequent requests",
						example: `{
							"status": "success",
							"data": {
								"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjA4N2Q1ZS0yYWU4LTRjYmMtYjE2Ny1mMWI1MzNiNzg5M2IiLCJpYXQiOjE2OTU2NjUyMjgsImV4cCI6MTY5NTY2NjEyOH0.Z0m6R8fFv2VUfQs2LeWL_UzNx27YR72-97FgqN4bdCw"
							}
						}`,
					}),
				},
			}),
		},
	});
	openApiInstance.addPath(
		"/api/auth/refreshtoken",
		{
			post: {
				description: "Refresh access token using refresh token",
				summary: "Refresh token",
				operationId: "refreshtoken",
				responses: {
					200: openApiInstance.declareSchema("Refresh token success", refreshTokenResponseSchema),
					403: openApiInstance.declareSchema("Could not refresh access token", errorSchema(403)),
				},
				tags: ["Auth"],
				requestSchema: {
					cookie: {
						refreshToken: Types.String({
							description: "Refresh token",
							required: true,
							example:
								"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjA4N2Q1ZS0yYWU4LTRjYmMtYjE2Ny1mMWI1MzNiNzg5M2IiLCJpYXQiOjE2OTU2NjcxMzYsImV4cCI6MTY5NTY2ODAzNn0.Cl5QBeBdCDLcU2d_0m76hxwJKrO4qWrUN6NQjXBURUM",
						}),
					},
				},
			},
		},
		true
	);
}
// LOGOUT
export function documentLogoutRequest() {
	const logoutResponseSchema = Types.Object({
		description: "Logout response",
		properties: {
			status: Types.String({
				description: "Request status (success, error)",
			}),
		},
	});
	openApiInstance.addPath(
		"/api/auth/logout",
		{
			post: {
				description: "Logout from API",
				summary: "Logout",
				operationId: "logout",
				responses: {
					200: openApiInstance.declareSchema("Logout success", logoutResponseSchema),
					401: openApiInstance.declareSchema("Unauthorized", errorSchema(401)),
				},
				tags: ["Auth"],
				security: [{ cookieSecurity: [] }],
			},
		},
		true
	);
}
