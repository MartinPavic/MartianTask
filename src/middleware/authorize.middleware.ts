import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { RoleEnumType, User } from "../entities/user.entity";
import HttpStatus from "http-status-codes";

export const authorize = (role: RoleEnumType) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const user: User = res.locals.user;

		if (!user) {
			return next(new AppError(HttpStatus.UNAUTHORIZED, "Invalid token or user does not exist"));
		}

		if (user.role !== role) {
			return next(new AppError(HttpStatus.FORBIDDEN, "Not allowed"));
		}

		next();
	} catch (err: any) {
		next(err);
	}
};
