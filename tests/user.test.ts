import { User } from "../src/entities/user.entity";
import { beforeAll, describe, test, expect, afterAll } from "@jest/globals";
import { DataType, IMemoryDb, newDb } from "pg-mem";
import { DataSource } from "typeorm";
import { v4 } from "uuid";
import { Delivery } from "../src/entities/delivery.entity";
import { DeliveryPriceCalculator } from "../src/entities/deliveryPriceCalculator.entity";

describe("User Tests", () => {
	let testDb: IMemoryDb;
	let dataSource: DataSource;
	beforeAll(async () => {
		testDb = newDb({ autoCreateForeignKeyIndices: true });
		testDb.public.registerFunction({
			name: "current_database",
			args: [],
			returns: DataType.text,
			implementation: (x) => `hello world: ${x}`,
		});

		testDb.public.registerFunction({
			name: "version",
			args: [],
			returns: DataType.text,
			implementation: (x) => `hello world: ${x}`,
		});

		testDb.registerExtension("uuid-ossp", (schema) => {
			schema.registerFunction({
				name: "uuid_generate_v4",
				returns: DataType.uuid,
				implementation: v4,
				impure: true,
			});
		});
		dataSource = await testDb.adapters.createTypeormDataSource({
			name: "test",
			type: "postgres",
			entities: [Delivery, DeliveryPriceCalculator, User],
			synchronize: true,
		});
		await dataSource.initialize();
		await dataSource.synchronize();
	});

	test("should create a user", async () => {
		const userRepository = dataSource.getRepository(User);
		const user = userRepository.create({
			name: "martin",
			email: "test@test.com",
			password: "password123",
		});
		expect(user).toBeInstanceOf(User);
		expect(user.name).toBe("martin");
		expect(user.email).toBe("test@test.com");
		expect(user.password).toBe("password123");
		await user.save();
	});

	test("should return user", async () => {
		const userRepository = dataSource.getRepository(User);
		const user = await userRepository.findOneBy({ email: "test@test.com" });
		expect(user).toBeInstanceOf(User);
		expect(user!.name).toBe("martin");
		expect(user!.email).toBe("test@test.com");
		expect(user!.password).not.toBe("password123");
	});
});
