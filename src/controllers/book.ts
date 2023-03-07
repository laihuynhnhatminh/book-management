import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import { Book } from '../models/book';
import { IBookQuery } from '../interfaces/book-query';

import { bookService } from '../services/book-service';
import { validateBook } from '../validation/validate-book';
import { validateUser } from '../validation/validate-user';

class BookController {
  public async createNewBook(req: Request, res: Response): Promise<void> {
    validateUser.ensureLoggedIn(req);
    const book = await new Book({
      ...req.body,
      user_id: req.user?._id
    }).save();

    res.status(201).send({
      success: true,
      data: { message: 'New book created successfully', book }
    });
  }

  public async editSpecificBook(req: Request, res: Response): Promise<void> {
    validateUser.ensureLoggedIn(req);
    validateBook.ensureValidEditFields(req, res);

    const book = await bookService.editSpecificBook(
      req.params.id,
      req.user?._id,
      req.body
    );
    validateBook.ensureValidBook(book, req.params.id);

    res.send({ success: true, data: { book } });
  }

  public async getBooks(req: Request, res: Response): Promise<void> {
    const filters: IBookQuery = bookService.getFilters(req);
    const sort: { [key: string]: SortOrder } | undefined =
      bookService.getSort(req);

    const books = await bookService.getBookList(
      req.user?._id,
      filters,
      req.query.limit as string,
      req.query.skip as string,
      sort,
      req.userRole as string
    );

    res.send({ success: true, data: { books } });
  }

  public async getSpecificBook(req: Request, res: Response): Promise<void> {
    const book = await bookService.getSpecificBook(
      req.params.id,
      req.user?._id,
      req.userRole as string
    );
    if (!book) {
    }
    res.send({ success: true, data: { book } });
  }

  public async deleteSpecificBook(req: Request, res: Response): Promise<void> {
    validateUser.ensureLoggedIn(req);

    const book = await bookService.deleteSpecificBook(
      req.params.id,
      req.user?._id
    );
    validateBook.ensureValidBook(book, req.params.id);

    res.send({ success: true, message: 'Delete successfully' });
  }
}

export const bookController = new BookController();
