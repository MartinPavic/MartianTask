export default {
	env: "NODE_ENV",
	port: "PORT",
	postgresConfig: {
		host: "POSTGRES_HOST",
		port: "POSTGRES_PORT",
		username: "POSTGRES_USER",
		password: "POSTGRES_PASSWORD",
		database: "POSTGRES_DB",
	},

	redisConfig: {
		host: "REDIS_HOST",
		port: "REDIS_PORT",
	},

	jwtSecretKey: "JWT_SECRET_KEY",

	smtp: {
		host: "EMAIL_HOST",
		pass: "EMAIL_PASS",
		port: "EMAIL_PORT",
		user: "EMAIL_USER",
	},
};
