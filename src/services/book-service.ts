import { Request } from 'express';
import { Document, Query, Schema, SortOrder } from 'mongoose';

import { Book, IBook } from '../models/book';
import { IBookQuery } from '../interfaces/book-query';
import { UserRoleEnum } from '../utils/common/enum';
import {
  COMMON_QUERIES,
  BOOK_NON_STRING_QUERIES
} from '../utils/common/book-filters';

import { toLowerCaseQuery } from '../utils/functions/lower-case-query';

class BookService {
  public async editSpecificBook(
    bookId: string,
    userId: Schema.Types.ObjectId | undefined,
    updatedBook: IBook
  ): Promise<Document<any, any, IBook> | null> {
    return Book.findOneAndUpdate(
      {
        _id: bookId,
        user_id: userId
      },
      updatedBook,
      { new: true }
    );
  }

  public async deleteSpecificBook(
    bookId: string,
    userId: Schema.Types.ObjectId | undefined
  ): Promise<Document<any, any, IBook> | null> {
    return Book.findOneAndDelete({
      _id: bookId,
      user_id: userId
    });
  }

  public async getBookList(
    userId: Schema.Types.ObjectId | undefined,
    filters: IBookQuery,
    limit: string,
    skip: string,
    sort: { [key: string]: SortOrder } | undefined,
    userRole: string
  ): Promise<Query<any, Document<IBook>>> {
    let query = {};
    switch (userRole) {
      case UserRoleEnum.USER:
        query = {
          $or: [{ user_id: userId }, { enabled: true }],
          ...filters
        };
        break;
      case UserRoleEnum.ADMIN:
        query = {
          ...filters
        };
        break;
      default:
        query = {
          ...filters,
          enabled: filters.enabled === false ? null : true
        };
    }
    return Book.find(query, null).sort(sort).limit(+limit).skip(+skip);
  }

  public async getSpecificBook(
    bookId: string,
    userId: Schema.Types.ObjectId | undefined,
    userRole: string
  ): Promise<Query<any, Document<IBook>>> {
    let query: any = { _id: bookId };
    switch (userRole) {
      case UserRoleEnum.USER:
        query = {
          $and: [{ $or: [{ user_id: userId }, { enabled: true }] }, query]
        };
        break;
      case UserRoleEnum.ADMIN:
        query = { ...query };
        break;
      default:
        query = { ...query, enabled: true };
    }
    return Book.findOne(query);
  }

  public getFilters(req: Request): IBookQuery {
    const filters: IBookQuery = {};
    Object.keys(req.query).forEach((k) => {
      if (!COMMON_QUERIES.includes(k) && req.query[k]) {
        if (BOOK_NON_STRING_QUERIES.includes(k))
          filters[k] = req.query[k] === 'true' ? true : false;
        else filters[k] = toLowerCaseQuery(req.query[k] as string);
      }
    });
    return filters;
  }

  public getSort(req: Request): { [key: string]: SortOrder } | undefined {
    const sort: { [key: string]: SortOrder } | undefined = {};
    Object.keys(req.query).forEach((k) => {
      if (req.query[k] && k === 'sortBy') {
        const parts = (req.query.sortBy as string).split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
      }
    });
    return sort;
  }
}

export const bookService = new BookService();
