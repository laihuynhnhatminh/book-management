import { IBookQuery } from '../interfaces/book-query';
import { Request, Response } from 'express';
import { Book } from '../models/book';

import { getBookService } from '../services/get-book';
import { validateEditFieldService } from '../services/validate-edit-field';

import {
  BOOK_NON_STRING_QUERIES,
  COMMON_QUERIES
} from '../utils/common/book-filters';

import { toLowerCaseQuery } from '../utils/functions/lower-case-query';
import { SortOrder } from 'mongoose';
import { UserRoleEnum } from '../utils/common/enum';
import CustomError from '../errors/custom-errors';

class BookController {
  public async createNewBook(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    if (req.userRole === UserRoleEnum.GUEST) {
      throw new CustomError('Please authenticate', 401);
    }
    const book = await new Book({
      ...req.body,
      user_id: req.user?._id
    }).save();

    res.status(201).send({
      success: true,
      data: { message: 'New book created successfully', book }
    });
  }

  public async editSpecificBook(
    req: Request,
    res: Response
  ): Promise<Response | void> {
    if (req.userRole === UserRoleEnum.GUEST) {
      throw new CustomError('Please authenticate', 401);
    }
    validateEditFieldService.isValidateBookEditFields(req, res);

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user?._id
      },
      req.body,
      { new: true }
    );

    if (!book) {
      throw new CustomError('No Book Found', 404);
    }
    res.send({ success: true, data: { book } });
  }

  public async getBooks(req: Request, res: Response): Promise<void> {
    const filters: IBookQuery = {};
    const sort: { [key: string]: SortOrder } | undefined = {};
    // Update sort and filters from query
    Object.keys(req.query).forEach((k) => {
      if (req.query[k]) {
        if (k === 'sortBy') {
          const parts = (req.query.sortBy as string).split('_');
          sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        if (!COMMON_QUERIES.includes(k)) {
          if (BOOK_NON_STRING_QUERIES.includes(k)) {
            filters[k] = req.query[k] === 'true' ? true : false;
          } else {
            filters[k] = toLowerCaseQuery(req.query[k] as string);
          }
        }
      }
    });

    const books = await getBookService.getBookList(
      req,
      res,
      filters,
      sort,
      req.userRole as string
    );
    if (!books) {
      throw new CustomError('No Book Found', 404);
    }

    res.send({ success: true, data: { books } });
  }

  public async getSpecificBook(req: Request, res: Response): Promise<void> {
    const book = await getBookService.getSpecificBook(
      req,
      res,
      req.userRole as string
    );
    if (!book) {
      throw new CustomError('No Book Found', 404);
    }
    res.send({ success: true, data: { book } });
  }

  public async deleteSpecificBook(req: Request, res: Response): Promise<void> {
    if (req.userRole === UserRoleEnum.GUEST) {
      throw new CustomError('Please authenticate', 401);
    }
    const book = await Book.findByIdAndDelete({
      _id: req.params.id,
      user_id: req.user?._id
    });

    if (!book) {
      throw new CustomError('No Book Found', 404);
    }
    res.send({ success: true, message: 'Delete successfully' });
  }
}

export const bookController = new BookController();
