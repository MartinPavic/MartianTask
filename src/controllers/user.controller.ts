import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";

class UserController {

	private userRepository = AppDataSource.getRepository(User);

	async all(request: Request, response: Response, next: NextFunction) {
		return this.userRepository.find();
	}

	async one(request: Request, response: Response, next: NextFunction) {
		const id = request.params.id;

		const user = await this.userRepository.findOneBy({ id });

		if (!user) {
			return "unregistered user";
		}
		return user;
	}
	
	async getCurrentUser(request: Request, response: Response, next: NextFunction) {
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
	}
}

const userController = new UserController();

export default userController;
