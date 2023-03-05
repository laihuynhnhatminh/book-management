// Dependencies
import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

// Models
import { User } from '../models/user';
import { CustomError } from '../utils/classes/custom-error-class';

interface IJWTPayload {
	_id: string;
}

class HandleAuthentication {
	public async userAuthentication(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Request | void> {
		if (!req.headers.authorization) {
			return next();
		}
		const authToken = req.header('Authorization')?.replace('Bearer ', '');
		jsonwebtoken.verify(
			authToken as string,
			process.env.JWT_SECRET_KEY as string,
			async (error, decoded) => {
				try {
					if (error) {
						const user = await User.findOne({
							'tokens.token': authToken
						});
						if (user) {
							user.tokens = user.tokens.filter(
								(token) => token.token !== authToken
							);
							await user.save();
							throw new CustomError('Token Expired', 401);
						}
						throw new CustomError('Fail To Authenticate', 401);
					}
					const userId = decoded as IJWTPayload;

					const user = await User.findOne({
						_id: userId._id
					});

					if (!user || user.enabled === false) {
						throw new CustomError('Fail To Authenticate', 401);
					}

					req.authToken = authToken;
					req.user = user;
					next();
				} catch (error: any) {
					res
						.status(error.errorCode | 500)
						.send({ success: false, message: error.message });
				}
			}
		);
	}
}

export const handleAuthentication = new HandleAuthentication();
