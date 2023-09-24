import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
import redisClient from "../utils/redis";
import { User } from "../entities/user.entity";

export default class JWTService {
	static signJwt(
		payload: Object,
		keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
		options: SignOptions
	) {
		const privateKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
		return jwt.sign(payload, privateKey, {
			...options,
			algorithm: "RS256",
		});
	};
	
	static verifyJwt<T>(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"): T | null {
		try {
			const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
			const decoded = jwt.verify(token, publicKey) as T;
	
			return decoded;
		} catch (error) {
			return null;
		}
	};
	
	static async signTokens(user: User): Promise<{ accessToken: string, refreshToken: string }> {
		// 1. Create Session
		redisClient.set(user.id, JSON.stringify(user), {
			EX: config.get<number>("redisCacheExpiresIn") * 60,
		});
	
		// 2. Create Access and Refresh tokens
		const accessToken = this.signJwt({ sub: user.id }, "accessTokenPrivateKey", {
			expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
		});
	
		const refreshToken = this.signJwt({ sub: user.id }, "refreshTokenPrivateKey", {
			expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
		});
	
		return { accessToken, refreshToken };
	};
	
}