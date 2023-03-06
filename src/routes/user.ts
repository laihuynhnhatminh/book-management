// Dependencies
import express from 'express';

// Controllers
import { userController } from '../controllers/user';

// Middlewares
import { handleAuthentication } from '../middlewares/authentication';

const router = express.Router();

router.post('/users/login', userController.userLogin);

router.get(
  '/users/me',
  handleAuthentication.userAuthentication,
  userController.getUserProfile
);

export { router };
