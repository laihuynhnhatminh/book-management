// Dependencies
import express from 'express';

// Controllers
import { userController } from '../controllers/user';

const router = express.Router();

router.post('/users/login', userController.userLogin);

export { router };
