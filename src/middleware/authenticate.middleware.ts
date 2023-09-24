import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import redisClient from "../utils/redis";
import JWTService from "../services/jwt.service";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import HttpStatus from "http-status-codes";
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return next(new AppError(HttpStatus.UNAUTHORIZED, "You are not logged in"));
		}

		// Validate the access token
		const decoded = JWTService.verifyJwt<{ sub: string }>(accessToken, "accessTokenPublicKey");

		if (!decoded) {
			return next(new AppError(HttpStatus.UNAUTHORIZED, `Invalid token or user doesn't exist`));
		}

		// Check if the user has a valid session
		const session = await redisClient.get(decoded.sub);

		if (!session) {
			return next(new AppError(HttpStatus.UNAUTHORIZED, `Invalid token or session has expired`));
		}

		// Check if the user still exist
		const user = await AppDataSource.getRepository(User).findOneBy({ id: JSON.parse(session).id });

		if (!user) {
			return next(new AppError(HttpStatus.UNAUTHORIZED, `Invalid token or user does not exist`));
		}

		// Add user to res.locals
		res.locals.user = user;

		next();
	} catch (err: any) {
		next(err);
	}
};
