import { Request, Response } from 'express';
import { Book } from '../models/book';
import { IBookQuery } from '../interfaces/book-query';
import { UserRoleEnum } from '../utils/common/enum';

class GetBookService {
	async getBookList(
		req: Request,
		res: Response,
		filters: IBookQuery,
		sort: { [key: string]: number },
		userRole: string
	): Promise<any> {
		console.log(userRole);
		let query = {};
		switch (userRole) {
			case UserRoleEnum.USER:
				query = {
					$and: [
						{
							$or: [{ user_id: req.user._id }, { enabled: true }],
							...filters
						}
					]
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
					enabled: true
				};
		}

		return Book.find(query, null, sort)
			.limit(+(req.query.limit as string))
			.skip(+(req.query.skip as string));
	}

	async getSpecificBook(req: Request, res: Response, userRole: string) {
		let query: any = { _id: req.params.id };
		switch (userRole) {
			case UserRoleEnum.USER:
				query = {
					$and: [{ $or: [{ user_id: req.user._id }, { enabled: true }] }, query]
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
