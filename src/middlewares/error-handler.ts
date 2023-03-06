import { NextFunction, Request, Response } from 'express';

import CustomError from '../errors/custom-errors';

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

  return res.status(500).json({ errors: { message: 'Something went wrong' } });
};
