import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/user.entity";

export class UserController {
	private userRepository = AppDataSource.getRepository(User);

	async all(request: Request, response: Response, next: NextFunction) {
		return this.userRepository.find();
	}

	async one(request: Request, response: Response, next: NextFunction) {
		const id = request.params.id;

		const user = await this.userRepository.findOne({
			where: { id },
		});

		if (!user) {
			return "unregistered user";
		}
		return user;
	}

	async save(request: Request, response: Response, next: NextFunction) {
		const { firstName, lastName, age } = request.body;

		const user = Object.assign(new User(), {
			firstName,
			lastName,
			age,
		});

		return this.userRepository.save(user);
	}

	async remove(request: Request, response: Response, next: NextFunction) {
		const id = request.params.id;

		let userToRemove = await this.userRepository.findOneBy({ id });

		if (!userToRemove) {
			return "this user not exist";
		}

		await this.userRepository.remove(userToRemove);

		return "user has been removed";
	}
}
export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = res.locals.user;

		res.status(200).status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (err: any) {
		next(err);
	}
};
