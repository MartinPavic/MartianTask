require("dotenv").config();
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entities/user.entity"
import config from "config";

const postgresConfig = config.get<{
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
  }>('postgresConfig');

export const AppDataSource = new DataSource({
    ...postgresConfig,
  type: 'postgres',
  synchronize: false,
  logging: "all",
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
})
