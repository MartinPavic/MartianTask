import { AppDataSource } from "../data-source";
import { Delivery } from "../entities/delivery.entity";
import { Request, Response, NextFunction } from "express";
import { CreateDeliveryInput } from "../schemas/delivery.schema";
import { DeliveryPriceCalculator } from "../entities/deliveryPriceCalculator.entity";
import logger from "../utils/logger";
import HttpStatus from "http-status-codes";
import {
	CreateDeliveryPriceCalculatorInput,
	UpdateDeliveryPriceCalculatorInput,
} from "../schemas/deliveryPriceCalculator.schema";
import DeliveryPriceCalculatorService from "../services/deliveryPriceCalculator.service";
import redisClient from "../utils/redis";
import AppError from "../utils/appError";
import EmailService from "../services/email.service";

class DeliveryController {
	private deliveryRepository = AppDataSource.getRepository(Delivery);
	private deliveryPriceCalculatorRepository = AppDataSource.getRepository(DeliveryPriceCalculator);

	create = async (request: Request<{}, {}, CreateDeliveryInput>, response: Response, next: NextFunction): Promise<void> => {
		try {
			let priceCalculatorJson = await redisClient.get("priceCalculator");
			if (!priceCalculatorJson) {
				const priceCalculatorDb = await this.deliveryPriceCalculatorRepository.findOne({
					where: { active: true },
				});
				if (!priceCalculatorDb) {
					const errMsg = "No active price controller found";
					logger.error(`[DeliveryController] ${errMsg}`);
					next(new AppError(HttpStatus.NOT_FOUND, errMsg));
					return;
				}
				priceCalculatorJson = JSON.stringify(priceCalculatorDb);
				await redisClient.set("priceCalculator", priceCalculatorJson);
			}
			const priceCalculator = this.deliveryPriceCalculatorRepository.create(
				JSON.parse(priceCalculatorJson) as object
			);
			const deliveryInput = request.body;
			const delivery = this.deliveryRepository.create({
				...deliveryInput,
				phoneNumber: deliveryInput.phoneNumber.format("NATIONAL"),
			});
			const price = DeliveryPriceCalculatorService.calculateDeliveryPrice(delivery, priceCalculator);
			const newDelivery = await this.deliveryRepository.save(delivery);
			await EmailService.sendEmail(newDelivery.email, "Delivery", JSON.stringify({ ...newDelivery, price }));
			response.status(HttpStatus.CREATED).json({
				status: "success",
				data: {
					delivery,
				},
			});
		} catch (err: any) {
			logger.error(`[DeliveryController] Create delivery failed with ${err.toString()}`);
			next(err);
		}
	}

	createPriceCalculator = async (
		request: Request<{}, {}, CreateDeliveryPriceCalculatorInput>,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const currentPriceCalculator = await this.deliveryPriceCalculatorRepository.findOneBy({ active: true });
			if (currentPriceCalculator) {
				logger.info(`[DeliveryController] Setting current price calculator active status to false`);
				await this.deliveryPriceCalculatorRepository.update({ active: false, updatedAt: new Date() }, currentPriceCalculator);
			}
			const priceCalculatorInput = request.body;
			const priceCalculator = this.deliveryPriceCalculatorRepository.create({
				...priceCalculatorInput,
				active: true,
			});
			const newPriceCalculator = await this.deliveryPriceCalculatorRepository.save(priceCalculator);
			await redisClient.set("priceCalculator", JSON.stringify(newPriceCalculator));
			logger.info(`[DeliveryController] Created new price calculator`);
			response.status(HttpStatus.CREATED).json({
				status: "success",
				data: {
					newPriceCalculator,
				},
			});
		} catch (err: any) {
			logger.error(`[DeliveryController] Create delivery price calculator failed with ${err.toString()}`);
			next(err);
		}
	}

	updatePriceCalculator = async(
		request: Request<{ id: string }, {}, UpdateDeliveryPriceCalculatorInput>,
		response: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const priceCalculatorInput = request.body;
			const priceCalculatorId = request.params.id;
			const priceCalculator = await this.deliveryPriceCalculatorRepository.findOneByOrFail({
				id: priceCalculatorId,
			});
			const updatedPriceCalculator = await this.deliveryPriceCalculatorRepository.update(
				{ ...priceCalculatorInput, updatedAt: new Date()},
				priceCalculator
			);
			if (!priceCalculatorInput.active) {
				await redisClient.del("priceCalculator");
			} else {
				await redisClient.set("priceCalculator", JSON.stringify(updatedPriceCalculator));
			}
			response.status(HttpStatus.CREATED).json({
				status: "success",
				data: {
					updatedPriceCalculator,
				},
			});
		} catch (err: any) {
			logger.error(`[DeliveryController] Create delivery price calculator failed with ${err.toString()}`);
			next(err);
		}
	}
}

const deliveryController = new DeliveryController();

export default deliveryController;
