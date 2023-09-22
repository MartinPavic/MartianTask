import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
import redisClient from "./connectRedis";
import { User } from "../entities/user.entity";

export const signJwt = (
	payload: Object,
	keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
	options: SignOptions
) => {
	const privateKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
	return jwt.sign(payload, privateKey, {
		...options,
		algorithm: "RS256",
	});
};

export const verifyJwt = <T>(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"): T | null => {
	try {
		const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
		const decoded = jwt.verify(token, publicKey) as T;

		return decoded;
	} catch (error) {
		return null;
	}
};

export const signTokens = async (user: User) => {
	// 1. Create Session
	redisClient.set(user.id, JSON.stringify(user), {
		EX: config.get<number>("redisCacheExpiresIn") * 60,
	});

	// 2. Create Access and Refresh tokens
	const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
		expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
	});

	const refreshToken = signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
		expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
	});

	return { accessToken, refreshToken };
};
