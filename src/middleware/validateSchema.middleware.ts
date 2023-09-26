import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const body = schema.parse({
			params: req.params,
			query: req.query,
			body: req.body,
		});
		req.body = body["body"];
		next();
	} catch (error) {
		if (error instanceof ZodError) {
			return res.status(400).json({
				status: "fail",
				errors: error.errors,
			});
		}
		next(error);
	}
};
