import config from "config";
import pino from "pino";

const env = config.get<string>("env")
const logger = pino({ name: "Martian", level: env === "production" ? "info" : "debug", transport: { target: "pino-pretty" } });

export default logger;
