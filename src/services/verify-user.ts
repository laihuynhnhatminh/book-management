// Models
import { Request, Response } from 'express-serve-static-core';
import { Aggregate } from 'mongoose';
import { User } from '../models/user';

// Utils
import { UserRoleEnum } from '../utils/common/enum';

class VerifyUser {
	public async checkUserRole(req: Request, res: Response) {
		if (!req.user) {
			return UserRoleEnum.GUEST;
		}

		const user = await this.getUserRole(req, res);
		return user[0].role.name;
	}

	public async isGuest(req: Request, res: Response) {
		if (!req.user) {
			throw new Error('Please authenticate');
		}
	}

	private async getUserRole(
		req: Request,
		res: Response
	): Promise<Aggregate<any>> {
		if (req.user) {
			return User.aggregate([
				{
					$lookup: {
						from: 'roles',
						localField: 'role_id',
						foreignField: '_id',
						as: 'role'
					}
				},
				{ $project: { _id: 1, email: 1, role: 1 } },
				{ $unwind: '$role' }
			]).match({ _id: req.user._id });
		}
	}
}

export const verifyUser = new VerifyUser();
