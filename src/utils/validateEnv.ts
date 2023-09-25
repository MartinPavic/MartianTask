import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
	cleanEnv(process.env, {
		NODE_ENV: str(),
		PORT: port(),
		POSTGRES_HOST: str(),
		POSTGRES_PORT: port(),
		POSTGRES_USER: str(),
		POSTGRES_PASSWORD: str(),
		POSTGRES_DB: str(),
		REDIS_HOST: str(),
		REDIS_PORT: port(),
		JWT_SECRET_KEY: str(),
		EMAIL_HOST: str(),
		EMAIL_PASS: str(),
		EMAIL_PORT: port(),
		EMAIL_USER: str(),
	});
};

export default validateEnv;
