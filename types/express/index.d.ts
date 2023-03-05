import { IUser } from '@app/models/user';

export {};

declare global {
	namespace Express {
		export interface Request {
			authToken?: string;
			user?: IUser;
		}
	}
}
