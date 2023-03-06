import { Request, Response } from 'express';
import { BOOK_PATCHABLE_FIELDS } from '../utils/common/book-filters';
import CustomError from '../errors/custom-errors';

class ValidateEditFieldService {
  public isValidateBookEditFields(req: Request, res: Response): boolean | void {
    const isValidEdition = Object.keys(req.body).every((k) =>
      BOOK_PATCHABLE_FIELDS.includes(k)
    );
    if (!isValidEdition) {
      throw new CustomError('Operation not valid', 403);
    }
  }
}

export const validateEditFieldService = new ValidateEditFieldService();
