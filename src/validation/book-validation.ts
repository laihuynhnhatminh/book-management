import { Request, Response } from 'express';
import BadRequestError from '../errors/bad-request-error';
import { BOOK_PATCHABLE_FIELDS } from '../utils/common/book-filters';
import { IBook } from '../models/book';
import { Document } from 'mongoose';

class BookValidation {
  public ensureValidEditFields(req: Request, res: Response): void {
    const isValidEdition = Object.keys(req.body).every((k) =>
      BOOK_PATCHABLE_FIELDS.includes(k)
    );
    if (!isValidEdition) {
      throw new BadRequestError('Operation not valid');
    }
  }

  public ensureValidBook(
    book: Document<any, any, IBook> | null,
    req: Request,
    res: Response
  ) {
    if (!book) {
      res.status(404).send({
        success: false,
        message: `The book with id ${req.params.id} could not be found`
      });
    }
  }
}

export const bookValidation = new BookValidation();
