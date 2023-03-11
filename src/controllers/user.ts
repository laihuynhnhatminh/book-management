import { Request, Response } from 'express';
import { User } from '../models/user';

export class UserController {
	async login(req: Request, res: Response): Promise<void> {
		const user = await User.login(req.body.email, req.body.password);

		const token = await user.generateAuthToken();
		res.send({ success: true, data: { token } });
	}
}
