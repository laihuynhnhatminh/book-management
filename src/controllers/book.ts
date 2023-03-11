import { Request, Response } from 'express';
import { SortOrder, Document } from 'mongoose';
import { Book, IBook } from '../models/book';
import { IBookQuery } from '../interfaces/book-query';

import { bookService } from '../services/book-service';
import { bookValidation } from '../validation/book-validation';
import { authValidation } from '../validation/auth-validation';

export class BookController {
	public async create(req: Request, res: Response): Promise<void> {
		authValidation.ensureLoggedIn(req.userRole);
		const book = await new Book({
			...req.body,
			user_id: req.user._id
		}).save();

		res.status(201).send({
			success: true,
			data: { message: 'New book created successfully', book }
		});
	}

	public async update(req: Request, res: Response): Promise<void> {
		authValidation.ensureLoggedIn(req.userRole);
		bookValidation.ensureValidEditFields(req, res);

		const book = await bookService.update(
			req.params.id,
			req.user._id,
			req.body
		);

		if (book) {
			this.sendSuccess(res, book);
		} else {
			this.sendBookNotFound(req.params.id, res);
		}
	}

	public async findAll(req: Request, res: Response): Promise<void> {
		const filters: IBookQuery = bookService.getFilters(req.query);
		const sort: { [key: string]: SortOrder } | undefined = bookService.getSort(
			req.query
		);

		const books = await bookService.findAll(
			req.user._id,
			filters,
			parseInt(req.query.limit as string),
			parseInt(req.query.skip as string),
			sort,
			req.userRole
		);

		res.send({ success: true, data: { books } });
	}

	public async find(req: Request, res: Response): Promise<void> {
		const book = await bookService.find(
			req.params.id,
			req.user._id,
			req.userRole
		);

		if (book) {
			this.sendSuccess(res, book);
		} else {
			this.sendBookNotFound(req.params.id, res);
		}
	}

	public async delete(req: Request, res: Response): Promise<void> {
		authValidation.ensureLoggedIn(req.userRole);

		const book = await bookService.delete(req.params.id, req.user._id);

		if (book) {
			this.sendSuccess(res);
		} else {
			this.sendBookNotFound(req.params.id, res);
		}
	}

	private sendSuccess(res: Response, book?: Document<IBook>): void {
		res.send({ success: true, book });
	}

	private sendBookNotFound(bookId: string, res: Response): void {
		res.status(404).send({
			success: false,
			message: `The book with id ${bookId} could not be found`
		});
	}
}
