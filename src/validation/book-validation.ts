import { Request, Response } from 'express';
import { BOOK_PATCHABLE_FIELDS } from '../utils/common/book-filters';
import BadRequestError from '../errors/bad-request-error';

class BookValidation {
  public ensureValidEditFields(req: Request, res: Response): void {
    const isValidEdition = Object.keys(req.body).every((k) =>
      BOOK_PATCHABLE_FIELDS.includes(k)
    );
    if (!isValidEdition) {
      throw new BadRequestError('Operation not valid');
    }
  }
}

export const bookValidation = new BookValidation();
