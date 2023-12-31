import { Delivery } from "../src/entities/delivery.entity";
import { DeliveryPriceCalculator } from "../src/entities/deliveryPriceCalculator.entity";
import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import { IMemoryDb, newDb, DataType } from "pg-mem";
import { DataSource, Unique } from "typeorm";
import { v4 } from "uuid";
import { User } from "../src/entities/user.entity";

describe("Delivery Tests", () => {
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

	test("should create a delivery", async () => {
		const deliveryRepository = dataSource.getRepository(Delivery);

		const delivery = deliveryRepository.create({
			firstName: "martin",
			lastName: "pavic",
			email: "martin.pavic97@gmail.com",
			phoneNumber: "+385 99 693 0055",
			deliveryDate: "2023-09-26T10:29:44.461Z",
			numberOfPackages: 2,
			deliveryDistance: 11,
		});
		expect(delivery).toBeInstanceOf(Delivery);
		expect(delivery.firstName).toBe("martin");
		expect(delivery.lastName).toBe("pavic");
		expect(delivery.email).toBe("martin.pavic97@gmail.com");
		expect(delivery.phoneNumber).toBe("+385 99 693 0055");
		expect(delivery.deliveryDate).toBe("2023-09-26T10:29:44.461Z");
		expect(delivery.numberOfPackages).toBe(2);
		expect(delivery.deliveryDistance).toBe(11);
		await delivery.save();
	});

	test("should return delivery", async () => {
		const deliveryRepository = dataSource.getRepository(Delivery);

		const delivery = await deliveryRepository.findOneBy({ firstName: "martin", lastName: "pavic" });
		expect(delivery).toBeInstanceOf(Delivery);
		expect(delivery!.firstName).toBe("martin");
		expect(delivery!.lastName).toBe("pavic");
		expect(delivery!.email).toBe("martin.pavic97@gmail.com");
		expect(delivery!.phoneNumber).toBe("+385 99 693 0055");
		expect(delivery!.deliveryDate).toBe("2023-09-26T10:29:44.461Z");
		expect(delivery!.numberOfPackages).toBe(2);
		expect(delivery!.deliveryDistance).toBe(11);
	});

	test("should update delivery", async () => {
		const deliveryRepository = dataSource.getRepository(Delivery);

		const deliveryUpdateInput = {
			firstName: "ivan",
			lastName: "ivic",
		};
		const delivery = await deliveryRepository.findOneBy({ firstName: "martin", lastName: "pavic" });
		expect(delivery).toBeInstanceOf(Delivery);
		await deliveryRepository.update({ id: delivery!.id }, deliveryUpdateInput);
		const updatedDelivery = await deliveryRepository.findOneBy({ id: delivery!.id });
		expect(updatedDelivery!.firstName).toBe("ivan");
		expect(updatedDelivery!.lastName).toBe("ivic");
	});

	test("should create delivery price calculator", async () => {
		const deliveryPriceCalculatorRepository = dataSource.getRepository(DeliveryPriceCalculator);

		const deliveryPriceCalculator = deliveryPriceCalculatorRepository.create({
			basePrice: 5,
			pricePerKm: 1,
			distancePriceIntervals: [],
			pricePerAdditionalPackage: 2,
		});
		expect(deliveryPriceCalculator).toBeInstanceOf(DeliveryPriceCalculator);
		expect(deliveryPriceCalculator.basePrice).toBe(5);
		expect(deliveryPriceCalculator.pricePerKm).toBe(1);
		expect(deliveryPriceCalculator.distancePriceIntervals).toBe([]);
		expect(deliveryPriceCalculator.pricePerAdditionalPackage).toBe(2);
		await deliveryPriceCalculator.save();
	});

	test("should return delivery price calculator", async () => {
		const deliveryPriceCalculatorRepository = dataSource.getRepository(DeliveryPriceCalculator);

		const deliveryPriceCalculator = await deliveryPriceCalculatorRepository.findOneBy({ active: true });
		expect(deliveryPriceCalculator).toBeInstanceOf(DeliveryPriceCalculator);
		expect(deliveryPriceCalculator!.basePrice).toBe(5);
		expect(deliveryPriceCalculator!.pricePerKm).toBe(1);
		expect(deliveryPriceCalculator!.distancePriceIntervals).toBe([]);
		expect(deliveryPriceCalculator!.pricePerAdditionalPackage).toBe(2);
	});

	test("should update delivery price calculator", async () => {
		const deliveryPriceCalculatorRepository = dataSource.getRepository(DeliveryPriceCalculator);
		const deliveryRepository = dataSource.getRepository(Delivery);

		const deliveryPriceCalculatorUpdateInput = {
			basePrice: 4,
			pricePerKm: 0.5,
		};
		const deliveryPriceCalculator = await deliveryPriceCalculatorRepository.findOneBy({ active: true });
		expect(deliveryPriceCalculator).toBeInstanceOf(DeliveryPriceCalculator);
		await deliveryPriceCalculatorRepository.update(
			{ id: deliveryPriceCalculator!.id },
			deliveryPriceCalculatorUpdateInput
		);
		const updatedDeliveryPriceCalculator = await deliveryRepository.findOneBy({ id: deliveryPriceCalculator!.id });
		expect(updatedDeliveryPriceCalculator!.firstName).toBe(5);
		expect(updatedDeliveryPriceCalculator!.lastName).toBe(0.5);
	});
});
