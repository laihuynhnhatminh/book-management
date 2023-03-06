import { Request, Response } from 'express';
import { Document, Query, SortOrder } from 'mongoose';

import { Book, IBook } from '../models/book';
import { IBookQuery } from '../interfaces/book-query';
import { UserRoleEnum } from '../utils/common/enum';

class GetBookService {
  async getBookList(
    req: Request,
    res: Response,
    filters: IBookQuery,
    sort: { [key: string]: SortOrder } | undefined,
    userRole: string
  ): Promise<Query<any, Document<IBook>>> {
    let query = {};
    switch (userRole) {
      case UserRoleEnum.USER:
        query = {
          $or: [{ user_id: req.user?._id }, { enabled: true }],
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
    return Book.find(query, null)
      .sort(sort)
      .limit(+(req.query.limit as string))
      .skip(+(req.query.skip as string));
  }

  async getSpecificBook(
    req: Request,
    res: Response,
    userRole: string
  ): Promise<Query<any, Document<IBook>>> {
    let query: any = { _id: req.params.id };
    switch (userRole) {
      case UserRoleEnum.USER:
        query = {
          $and: [
            { $or: [{ user_id: req.user?._id }, { enabled: true }] },
            query
          ]
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
}

export const getBookService = new GetBookService();
