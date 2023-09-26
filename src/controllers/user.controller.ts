import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";

class UserController {
	private userRepository = AppDataSource.getRepository(User);

	getCurrentUser = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
		try {
			const user = response.locals.user;

			response.status(200).json({
				status: "success",
				data: {
					user,
				},
			});
		} catch (err: any) {
			next(err);
		}
	};
}

const userController = new UserController();

export default userController;
