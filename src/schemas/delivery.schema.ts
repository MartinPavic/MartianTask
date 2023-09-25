import { number, object, string, TypeOf } from "zod";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
export const createDeliverySchema = object({
	body: object({
		firstName: string({
			required_error: "First name is required",
		}),
		lastName: string({
			required_error: "Last name is required",
		}),
		email: string({
			required_error: "Email address is required",
		}).email("Invalid email address"),
		phoneNumber: string({
			required_error: "Phone number is required",
		})
			.refine((value) => isValidPhoneNumber(value), { message: "Phone number is not valid" })
			.transform((value) => parsePhoneNumber(value)),
		deliveryDate: string({
			required_error: "Delivery date is required",
		})
			.refine((value) => !isNaN(Date.parse(value)), { message: "Delivery date is not valid" })
			.transform((value) => new Date(value)),
		numberOfPackages: number({
			required_error: "Number of packages is required",
		}),
		deliveryDistance: number({
			required_error: "Delivery distance is required",
		}),
	}),
});

export type CreateDeliveryInput = TypeOf<typeof createDeliverySchema>["body"];
