import { Schema, model, Model, HydratedDocument } from 'mongoose';
import validator from 'validator';
import jsonwebtoken from 'jsonwebtoken';

import { PASSWORD_REGEX } from '../utils/common/regex';
import UnauthorizeError from '../errors/unauthorize-error';
import BadRequestError from '../errors/bad-request-error';

export interface IUser {
	_id: Schema.Types.ObjectId;
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	enabled: boolean;
	avatar_url?: string;
	role_id: string;
}

interface IUserMethods extends Model<IUser> {
	generateAuthToken(): Promise<string>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
	login(
		email: string,
		password: string
	): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value: string) {
			if (!validator.isEmail(value))
				throw new BadRequestError('Email is invalid');
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		validate(value: string) {
			if (!value.match(PASSWORD_REGEX))
				throw new BadRequestError(
					'Password must has at least one uppercase word and one number'
				);
		}
	},
	firstName: {
		type: String,
		trim: true
	},
	lastName: {
		type: String,
		trim: true
	},
	enabled: {
		type: Boolean,
		default: true
	},
	avatar_url: {
		type: String
	},
	role_id: {
		type: String,
		required: true
	}
});

userSchema.methods.toJSON = function () {
	const userObject = this.toObject();
	delete userObject.password;
	delete userObject.role_id;
	delete userObject.enabled;

	return userObject;
};

userSchema.method('generateAuthToken', async function (): Promise<string> {
	const token = jsonwebtoken.sign(
		{ _id: this._id.toString() },
		process.env.JWT_SECRET_KEY as string,
		{ expiresIn: '1h' }
	);
	return token;
});

userSchema.static(
	'login',
	async function login(email: string, password: string) {
		const user = await User.findOne({ email });
		if (!user || user.password !== password) {
			throw new UnauthorizeError('Wrong username or password');
		}
		if (!user.enabled) {
			throw new UnauthorizeError('User Account is disabled');
		}
		return user;
	}
);

export const User = model<IUser, UserModel>('User', userSchema);
