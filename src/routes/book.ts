import { Application } from 'express';
import { BookController } from '../controllers/book';

const bookRoutes = (app: Application, bookController: BookController): void => {
	app.post('/books', (req, res) => bookController.create(req, res));
	app.patch('/books/:id', (req, res) => bookController.update(req, res));
	app.get('/books', (req, res) => bookController.findAll(req, res));
	app.get('/books/:id', (req, res) => bookController.find(req, res));
	app.delete('/books/:id', (req, res) => bookController.delete(req, res));
};

export default bookRoutes;
