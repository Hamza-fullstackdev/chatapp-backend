import type { NextFunction, Request, Response } from 'express';
import { config } from '../config/env.config.js';
import errorHandler from '../utils/app-error.js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import db from '../config/connection.js';
import type { User } from '../types/auth.js';

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies[config.AUTH_COOKIE!];

  if (!token) {
    return next(errorHandler(400, 'Unauthorized user, please login first'));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET!) as JwtPayload;

    const result = await db.query('SELECT * FROM users WHERE id = $1', [
      decoded.id,
    ]);

    if (!result.rowCount || result.rowCount < 1) {
      return next(errorHandler(401, 'Unauthorized, please login first'));
    }

    req.user = result.rows[0] as User;
    next();
  } catch (error) {
    next(errorHandler(401, 'Invalid or expired token'));
  }
};
