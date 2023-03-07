import { Request, Response } from 'express';
import { Document } from 'mongoose';
import { BOOK_PATCHABLE_FIELDS } from '../utils/common/book-filters';
import { IBook } from '../models/book';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

class ValidateBookService {
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
    bookId: string
  ): void {
    if (!book) {
      throw new NotFoundError(`The book with id ${bookId} could not be found`);
    }
  }
}

export const validateBookService = new ValidateBookService();
