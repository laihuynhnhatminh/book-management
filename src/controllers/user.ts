import { Request, Response } from 'express';
import { User } from '../models/user';

// Services
import { verifyUserService } from '../services/verify-user';

// Utils

class UserController {
	async userLogin(req: Request, res: Response) {
		try {
			const user = await User.findByCredential(
				req.body.email,
				req.body.password
			);

			if (user.enabled === false) {
				throw new Error('Please authenticate');
			}

			const token = await user.generateAuthToken();
			res.send({ success: true, data: { token } });
		} catch (error: any) {
			res
				.status(error.code || 400)
				.send({ success: false, data: { error: error.message } });
		}
	}

	async getUserProfile(req: Request, res: Response) {
		try {
			await verifyUserService.isGuest(req, res);
			res.send({
				success: true,
				data: { user: req.user, token: req.authToken }
			});
		} catch (error: any) {
			res
				.status(error.code || 400)
				.send({ success: false, data: { error: error.message } });
		}
	}
}

export const userController = new UserController();
