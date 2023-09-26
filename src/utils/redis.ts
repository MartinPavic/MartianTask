import config from "config";
import { createClient } from "redis";
import logger from "./logger";

const redisConfig = config.get<{ host: string; port: number }>("redisConfig");

const redisClient = createClient({
	url: `redis://${redisConfig.host}:${redisConfig.port}`,
});

const connectRedis = async () => {
	try {
		await redisClient.connect();
		logger.info("Redis client connected successfully");
	} catch (error) {
		logger.error(error);
		logger.debug("Retrying after 5 seconds...")
		setTimeout(connectRedis, 5000);
	}
};

connectRedis();

export default redisClient;
