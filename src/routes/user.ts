import express from 'express';

import { userController } from '../controllers/user';
import { handleAuthentication } from '../middlewares/authentication';

const router = express.Router();

router.post('/users/login', userController.userLogin);

router.get(
	'/users/me',
	handleAuthentication.userAuthentication,
	userController.getUserProfile
);

export { router };
