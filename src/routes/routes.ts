import express from 'express';
import { UserController } from '../controllers/user';
import { BookController } from '../controllers/book';
import bookRoutes from './book';
import userRoutes from './user';

const routes = (app: express.Application): void => {
	bookRoutes(app, new BookController());
	userRoutes(app, new UserController());
};

export default routes;
