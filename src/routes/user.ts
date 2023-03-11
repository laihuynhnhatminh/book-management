import { Application } from 'express';
import { UserController } from '../controllers/user';

const userRoutes = (app: Application, userController: UserController): void => {
	app.post('/users/login', (req, res) => userController.login(req, res));
};

export default userRoutes;
