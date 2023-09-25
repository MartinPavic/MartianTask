require("dotenv").config();
import express, { Application } from "express";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import config from "config";
import validateEnv from "./utils/validateEnv";
import { initOpenApi } from "./openapi";
import router from "./routes";
import AppError from "./utils/appError";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger";
import { addPathsToOpenApi } from "./documentation";
import cors from "./middleware/cors.middleware";
import cookieParser from "cookie-parser";
const helmet = require("helmet");

async function run(): Promise<void> {
	validateEnv(); // Validate config (environment variables)
	const env = config.get<string>("env");

	await AppDataSource.initialize(); // Initialize data source (database connection)

	const app = express(); // Construct express app

	app.use(express.json()); // Body parser
	app.use(cors); // CORS
	app.use(helmet()); // HTTP Response headers
	app.use(cookieParser()); // Cookie parser

	if (env !== "production") app.use(pinoHttp({ logger: logger }));

	app.use("/api", router); // Setup routes
	addPathsToOpenApi();
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
	app.listen(port, (): void => {
		console.info("*************** Environment: " + env + " ********************");
		console.info(`Server is running on port ${port}`);
	});
}

run();
