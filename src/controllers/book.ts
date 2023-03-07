import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import { Book } from '../models/book';
import { IBookQuery } from '../interfaces/book-query';

import { bookService } from '../services/book-service';
import { bookValidation } from '../validation/book-validation';
import { authValidation } from '../validation/auth-validation';

class BookController {
  public async create(req: Request, res: Response): Promise<void> {
    authValidation.ensureLoggedIn(req?.userRole, req?.user);
    const book = await new Book({
      ...req.body,
      user_id: req.user?._id
    }).save();

    res.status(201).send({
      success: true,
      data: { message: 'New book created successfully', book }
    });
  }

  public async update(req: Request, res: Response): Promise<void> {
    authValidation.ensureLoggedIn(req?.userRole, req?.user);
    bookValidation.ensureValidEditFields(req, res);

    const book = await bookService.update(
      req.params.id,
      req.user?._id,
      req.body
    );
    bookValidation.ensureValidBook(book, req, res);

    if (book) res.send({ success: true, data: { book } });
  }

  public async findAll(req: Request, res: Response): Promise<void> {
    const filters: IBookQuery = bookService.getFilters(req.query);
    const sort: { [key: string]: SortOrder } | undefined = bookService.getSort(
      req.query
    );

    const books = await bookService.findAll(
      req.user?._id,
      filters,
      parseInt(req.query.limit as string),
      parseInt(req.query.skip as string),
      sort,
      req.userRole as string
    );

    res.send({ success: true, data: { books } });
  }

  public async find(req: Request, res: Response): Promise<void> {
    const book = await bookService.find(
      req.params.id,
      req.user?._id,
      req.userRole as string
    );
    bookValidation.ensureValidBook(book, req, res);

    if (book) res.send({ success: true, data: { book } });
  }

  public async delete(req: Request, res: Response): Promise<void> {
    authValidation.ensureLoggedIn(req?.userRole, req?.user);

    const book = await bookService.delete(req.params.id, req.user?._id);
    bookValidation.ensureValidBook(book, req, res);

    if (book) res.send({ success: true, message: 'Delete successfully' });
  }
}

export const bookController = new BookController();
