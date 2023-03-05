// Dependencies
import { Request, Response } from 'express';
import { IBookQuery } from '../interfaces/book-query';

// Models
import { Book } from '../models/book';

// Services
import { verifyUserService } from '../services/verify-user';
import { getBookService } from '../services/get-book';

// Constant/Enum
import {
	BOOK_NON_STRING_QUERIES,
	BOOK_PATCHABLE_FIELDS,
	COMMON_QUERIES
} from '../utils/common/book-filters';

// Utils function
import { toLowerCaseQuery } from '../utils/toLowerCaseQuery';

class BookController {
	public async createNewBook(req: Request, res: Response): Promise<void> {
		try {
			await verifyUserService.isGuest(req, res);
			const book = await new Book({
				...req.body,
				user_id: req.user._id
			}).save();

			res.status(201).send({
				success: true,
				data: { message: 'New book created successfully', book }
			});
		} catch (error: any) {
			res.status(500).send({ success: false, data: { error: error.message } });
		}
	}

	public async editSpecificBook(req: Request, res: Response): Promise<void> {
		const isValidEdition = Object.keys(req.body).every((k) =>
			BOOK_PATCHABLE_FIELDS.includes(k)
		);
		if (!isValidEdition) {
			throw new Error('Operation not valid');
		}
		try {
			await verifyUserService.isGuest(req, res);
			const book = await Book.findOneAndUpdate(
				{
					_id: req.params.id,
					user_id: req.user._id
				},
				req.body,
				{ new: true }
			);

			if (!book) {
				throw new Error('No book found');
			}
			res.send(book);
		} catch (error: any) {
			res.status(500).send({ success: false, data: { error: error.message } });
		}
	}

	public async getBooks(req: Request, res: Response): Promise<void> {
		const userRole = await verifyUserService.checkUserRole(req, res);
		const filters: IBookQuery = {};
		const sort: { [key: string]: number } = {};
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

		try {
			const books = await getBookService.getBookList(
				req,
				res,
				filters,
				sort,
				userRole
			);
			res.send(books);
		} catch (error: any) {
			res.status(400).send({ success: false, data: { error: error.message } });
		}
	}

	public async getSpecificBook(req: Request, res: Response): Promise<void> {
		const userRole = await verifyUserService.checkUserRole(req, res);
		try {
			const book = await getBookService.getSpecificBook(req, res, userRole);
			if (!book) {
				throw new Error('No book found');
			}
			res.send({ success: true, data: book });
		} catch (error: any) {
			res.status(400).send({ success: false, data: { error: error.message } });
		}
	}

	public async deleteSpecificBook(req: Request, res: Response): Promise<void> {
		try {
			await verifyUserService.isGuest(req, res);
			const book = await Book.findByIdAndDelete({
				_id: req.params.id,
				user_id: req.user._id
			});

			if (!book) {
				throw new Error('No book found');
			}
			res.send({ success: true, data: { message: 'Delete successfully' } });
		} catch (error: any) {
			res.status(500).send({ success: false, data: { error: error.message } });
		}
	}
}

export const bookController = new BookController();
