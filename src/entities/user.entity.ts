import { Entity, Column, Index, BeforeInsert } from "typeorm";
import Model from "./model.entity";
import bcrypt from "bcryptjs";

export enum RoleEnumType {
	USER = "user",
	ADMIN = "admin",
}

@Entity("user")
export class User extends Model {
	@Column()
	name: string;

	@Index("email_index")
	@Column({
		unique: true,
	})
	email: string;

	@Column()
	password: string;

	@Column({
		type: "enum",
		enum: RoleEnumType,
		default: RoleEnumType.USER,
	})
	role: RoleEnumType;

	toJSON() {
		return { ...this, password: undefined, verified: undefined };
	}

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 12);
	}

	static async comparePasswords(
		password: string,
		hashedPassword: string
	) {
		return await bcrypt.compare(password, hashedPassword);
	}
}
