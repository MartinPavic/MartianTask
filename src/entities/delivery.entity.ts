import { Column, Entity } from "typeorm";
import Model from "./model.entity";

@Entity("delivery")
export class Delivery extends Model {
	@Column()
	firstName: string

	@Column()
	lastName: string

	@Column()
	email: string

	@Column()
	phoneNumber: string

	@Column()
	deliveryDate: Date

	@Column()
	numberOfPackages: number

	@Column()
	deliveryDistance: number
}