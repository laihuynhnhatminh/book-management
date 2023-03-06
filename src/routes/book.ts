// Dependencies
import express from 'express';

// Controllers
import { bookController } from '../controllers/book';

const router = express.Router();

router.post('/books', bookController.createNewBook);

router.patch('/books/:id', bookController.editSpecificBook);

router.get('/books', bookController.getBooks);

router.get('/books/:id', bookController.getSpecificBook);

router.delete('/books/:id', bookController.deleteSpecificBook);

export { router };
