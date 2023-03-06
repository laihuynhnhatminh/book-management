// Interfaces
import { NextFunction, Request, Response } from 'express';

// Error handling
import CustomError from '../errors/custom-errors';

// @ts-ignore
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ success: false, errors: err.message });
  }

  res.status(500).json({ errors: { message: 'Something went wrong' } });
};
