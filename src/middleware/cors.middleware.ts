import { Request, Response, NextFunction } from "express";

const cors = (_req: Request, res: Response, next: NextFunction): void => {
	res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin",
	);
	res.header("Access-Control-Expose-Headers", "Authorization");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, PUT, PATCH, POST, DELETE, OPTIONS",
	);
	next();
};

export default cors;
