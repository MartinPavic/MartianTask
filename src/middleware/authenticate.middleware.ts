import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import redisClient from '../utils/connectRedis';
import { verifyJwt } from '../utils/jwt';
import { AppDataSource } from '../data-source';
import { User } from '../entities/user.entity';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

	const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return next(new AppError(401, 'You are not logged in'));
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      'accessTokenPublicKey'
    );

    if (!decoded) {
      return next(new AppError(401, `Invalid token or user doesn't exist`));
    }

    // Check if the user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new AppError(401, `Invalid token or session has expired`));
    }

    // Check if the user still exist
    const user = await AppDataSource.getRepository(User).findOneBy({ id: JSON.parse(session).id });

    if (!user) {
      return next(new AppError(401, `Invalid token or user does not exist`));
    }

    // Add user to res.locals
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};

