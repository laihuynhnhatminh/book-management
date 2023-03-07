import { NextFunction, Request, Response } from 'express';
import DomainError from '../errors/domain-error';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof DomainError) {
    return res
      .status(err.statusCode)
      .send({ success: false, errors: err.message });
  }
  console.log(err);
  return res.status(500).json({ errors: { message: 'Something went wrong' } });
};
