import express from 'express';
import { bookController } from '../controllers/book';
import { handleAuthentication } from '../middlewares/authentication';

const router = express.Router();

router.post(
	'/books',
	handleAuthentication.userAuthentication,
	bookController.createNewBook
);

router.patch(
	'/books/:id',
	handleAuthentication.userAuthentication,
	bookController.editSpecificBook
);

router.get(
	'/books',
	handleAuthentication.userAuthentication,
	bookController.getBooks
);

router.get(
	'/books/:id',
	handleAuthentication.userAuthentication,
	bookController.getSpecificBook
);

router.delete(
	'/books/:id',
	handleAuthentication.userAuthentication,
	bookController.deleteSpecificBook
);

export { router };
