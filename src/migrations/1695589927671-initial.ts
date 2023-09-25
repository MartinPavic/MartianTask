import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1695589927671 implements MigrationInterface {
    name = 'Initial1695589927671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "delivery_price_calculator" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "basePrice" integer NOT NULL,
                "pricePerKm" integer NOT NULL,
                "distancePriceIntervals" jsonb NOT NULL,
                "pricePerAdditionalPackage" integer NOT NULL,
                "active" boolean NOT NULL,
                CONSTRAINT "PK_14fc2926f6fa693ffcbcdeaf149" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "delivery" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying NOT NULL,
                "deliveryDate" TIMESTAMP NOT NULL,
                "numberOfPackages" integer NOT NULL,
                "deliveryDistance" integer NOT NULL,
                CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "public"."user_role_enum" NOT NULL DEFAULT 'user',
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "email_index" ON "user" ("email")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."email_index"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "delivery"
        `);
        await queryRunner.query(`
            DROP TABLE "delivery_price_calculator"
        `);
    }

}
