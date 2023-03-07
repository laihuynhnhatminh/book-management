import express from 'express';
import { bookController } from '../controllers/book';

const router = express.Router();

router.post('/books', bookController.create);

router.patch('/books/:id', bookController.update);

router.get('/books', bookController.findAll);

router.get('/books/:id', bookController.find);

router.delete('/books/:id', bookController.delete);

export { router };
