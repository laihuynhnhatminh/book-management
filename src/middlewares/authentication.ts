// Dependencies
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

interface IJWTPayload {
	_id: string;
}

// Models
import { User } from '../models/user';

class handleAuthentication {
	public async userAuthentication(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Request | void> {
		if (!req.headers.authorization) {
			return next();
		}
		try {
			const authToken = req.header('Authorization')?.replace('Bearer ', '');
			jwt.verify(
				authToken as string,
				process.env.JWT_SECRET_KEY as string,
				async (error, decoded) => {
					if (error) {
						const user = await User.findOne({
							'tokens.token': authToken
						});
						if (user) {
							user.tokens = user.tokens.filter(
								(token) => token.token !== authToken
							);
							await user.save();
							throw new Error('Token expired');
						}
						throw new Error('No such User exist');
					}
					const userId = decoded as IJWTPayload;

					const user = await User.findOne({
						_id: userId._id
					});

					if (!user) {
						throw new Error('User not found');
					}
					if (user.enabled === false) {
						throw new Error('User disabled');
					}

					req.authToken = authToken;
					req.user = user;
					next();
				}
			);
		} catch (error: any) {}
	}
}
