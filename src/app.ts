require("dotenv").config();
import express, { Application } from "express";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import config from "config";
import validateEnv from "./utils/validateEnv";
import { initOpenApi } from "./openapi";
import { OpenApi, textPlain } from "ts-openapi";
import router from "./routes";
import AppError from "./utils/appError";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger";

function hello(_request: Request, response: Response) {
	response.send("Hello World!");
}

function initHello(app: Application, openApi: OpenApi) {
	app.get("/", hello);

	// declare our API
	openApi.addPath(
		"/", // this is API path
		{
			// API method
			get: {
				description: "Hello world", // Method description
				summary: "Demo get request to show how to declare APIs", // Method summary
				operationId: "get-hello-op", // an unique operation id
				responses: {
					// here we declare the response types
					200: textPlain("Successful Operation"),
				},
				tags: ["Dummy Apis"], // these tags group your methods in UI
			},
		},
		true // make method visible
	);
}

async function run(): Promise<void> {
	validateEnv(); // Validate config (environment variables)

	await AppDataSource.initialize(); // Initialize data source (database connection)

	const app = express(); // Construct express app
	app.use(pinoHttp({ logger: logger }));

	app.use("/api", router); // Setup routes
	initOpenApi(app); // Setup documentation

	// Route does not exist
	app.all("*", (req: Request, res: Response, next: NextFunction) => {
		next(new AppError(404, `Route ${req.originalUrl} not found`));
	});

	// Global error handler
	app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
		error.status = error.status || "error";
		error.statusCode = error.statusCode || 500;

		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		});
	});

	const port = config.get<number>("port");
	const env = config.get<string>("env");
	app.listen(port, (): void => {
		console.info("*************** Environment: " + env + " ********************");
		console.info(`Server is running on port ${port}`);
	});
}

run();
