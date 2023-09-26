import { dataSource, teardownTestDB } from "../src/testHelper";
import { User } from "../src/entities/user.entity";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";

beforeAll(async () => {
	await dataSource.initialize();
	await dataSource.synchronize()
});

afterAll(() => {
	teardownTestDB();
});

describe("User Tests", () => {
	const userRepository = dataSource.getRepository(User);
	test("should create a user", async () => {
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
		const user = await userRepository.findOneBy({ email: "test@test.com" });
		expect(user).toBeInstanceOf(User);
		expect(user!.name).toBe("martin");
		expect(user!.email).toBe("test@test.com");
		expect(user!.password).not.toBe("password123");
	});
});
