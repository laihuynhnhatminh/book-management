import { IBook } from 'src/models/book';
import { IUser } from 'src/models/user';

export interface IResponseData {
	success: boolean;
	data: {
		error?: {
			message: string;
		};
		book?: IBook;
		User?: IUser;
	};
}
