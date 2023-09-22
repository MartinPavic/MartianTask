import config from "config";
import { CookieOptions, Request, Response, NextFunction } from "express";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import HttpStatus from "http-status-codes";
import { signJwt, signTokens, verifyJwt } from "../utils/jwt";
import AppError from "../utils/appError";
import redisClient from "../utils/connectRedis";

const cookiesOptions: CookieOptions = {
	httpOnly: true,
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
};

const accessTokenCookieOptions: CookieOptions = {
	...cookiesOptions,
	expires: new Date(Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000),
	maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
	...cookiesOptions,
	expires: new Date(Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000),
	maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

class AuthController {
	private userRepository = AppDataSource.getRepository(User);

	async register(request: Request<{}, {}, CreateUserInput>, response: Response, next: NextFunction): Promise<void> {
		try {
			const { name, password, email } = request.body;
			// 1. Create user
			const user = this.userRepository.create({
				name,
				email: email.toLowerCase(),
				password,
			});
			// 2. Send response
			response.status(HttpStatus.CREATED).json({
				status: "success",
				data: {
					user,
				},
			});
		} catch (err: any) {
			// When the error code is 23505 then it indicates that a user with that email already exists in the database.
			if (err.code === "23505") {
				response.status(HttpStatus.BAD_REQUEST).json({
					status: "fail",
					message: "User with that email already exist",
				});
				return;
			}
			next(err);
		}
	}

	async login(request: Request<{}, {}, LoginUserInput>, response: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = request.body;
			const user = await this.userRepository.findOneBy({ email });

			// 1. Check if user exists and password is valid
			if (!user || !(await User.comparePasswords(password, user.password))) {
				return next(new AppError(HttpStatus.BAD_REQUEST, "Invalid email or password"));
			}

			// 2. Sign Access and Refresh Tokens
			const { accessToken, refreshToken } = await signTokens(user);

			// 3. Add Cookies
			response.cookie("accessToken", accessToken, accessTokenCookieOptions);
			response.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
			response.cookie("loggedIn", true, {
				...accessTokenCookieOptions,
				httpOnly: false,
			});

			// 4. Send response
			response.status(HttpStatus.OK).json({
				status: "success",
				accessToken,
			});
		} catch (err: any) {
			next(err);
		}
	}

	async refreshToken(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			const refreshToken = request.cookies.refreshToken;

			const message = "Could not refresh access token";

			if (!refreshToken) {
				return next(new AppError(HttpStatus.FORBIDDEN, message));
			}

			// 1. Validate refresh token
			const decoded = verifyJwt<{ sub: string }>(refreshToken, "refreshTokenPublicKey");

			if (!decoded) {
				return next(new AppError(HttpStatus.FORBIDDEN, message));
			}

			// 2. Check if user has a valid session
			const session = await redisClient.get(decoded.sub);

			if (!session) {
				return next(new AppError(HttpStatus.FORBIDDEN, message));
			}

			// 3. Check if user still exist
			const user = await this.userRepository.findOneBy({ id: JSON.parse(session).id });

			if (!user) {
				return next(new AppError(HttpStatus.FORBIDDEN, message));
			}

			// 4. Sign new access token
			const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
				expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
			});

			// 5. Add Cookies
			response.cookie("accessToken", accessToken, accessTokenCookieOptions);
			response.cookie("loggedIn", true, {
				...accessTokenCookieOptions,
				httpOnly: false,
			});

			// 6. Send response
			response.status(HttpStatus.OK).json({
				status: "success",
				accessToken,
			});
		} catch (err: any) {
			next(err);
		}
	}

	async logout(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			const user = response.locals.user;

			// 1. Remove redis session
			await redisClient.del(user.id);

			// 2. Update cookies
			response.cookie("accessToken", "", { maxAge: -1 });
			response.cookie("refreshToken", "", { maxAge: -1 });
			response.cookie("loggedIn", "", { maxAge: -1 });

			// 3. Send response
			response.status(HttpStatus.OK).json({
				status: "success",
			});
		} catch (err: any) {
			next(err);
		}
	}
}

const authController = new AuthController();

export default authController;
