import { DataSource } from "typeorm";
import { newDb } from "pg-mem";
import { Delivery } from "./entities/delivery.entity";
import { DeliveryPriceCalculator } from "./entities/deliveryPriceCalculator.entity";
import { User } from "./entities/user.entity";

const testDb = newDb({ autoCreateForeignKeyIndices: true });
export const dataSource: DataSource = testDb.adapters.createTypeormDataSource({
	name: "test",
	type: "postgres",
	entities: [Delivery, DeliveryPriceCalculator, User],
	synchronize: true,
});

export function teardownTestDB() {
	dataSource.destroy();
}
