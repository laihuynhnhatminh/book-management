// Dependencies
import { Schema, model, Model, HydratedDocument } from 'mongoose';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';

// Constants
import { PASSWORD_REGEX } from '../utils/common/regex';

export interface IUser {
	_id: Schema.Types.ObjectId;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	enabled: boolean;
	avatar: string;
	role_id: string;
	tokens: { token: string; _id: Schema.Types.ObjectId }[];
}

interface IUserMethods extends Model<IUser> {
	generateAuthToken(): Promise<string>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
	findByCredential(
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
		validator(value: string) {
			if (!validator.isEmail(value)) throw new Error('Email is invalid');
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 8,
		validate(value: string) {
			if (!value.match(PASSWORD_REGEX)) throw new Error('Password is invalid');
		}
	},
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true
	},
	enabled: {
		type: Boolean,
		default: true
	},
	avatar: {
		type: String
	},
	role_id: {
		type: String,
		required: true
	},
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
});

// Remove sensitive datas from user JSON file
userSchema.methods.toJSON = function () {
	const userObject = this.toObject();
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.role_id;
	delete userObject.enabled;

	return userObject;
};

// Generate jwt token
userSchema.method('generateAuthToken', async function (): Promise<string> {
	const token = jwt.sign(
		{ _id: this._id.toString() },
		process.env.JWT_SECRET_KEY as string,
		{ expiresIn: '1h' }
	);
	this.tokens = this.tokens.concat({ token });
	await this.save();
	return token;
});

// Get user by credentials
userSchema.static(
	'findByCredential',
	async function findByCredential(email: string, password: string) {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('Unable to login');
		}

		if (user.password !== password) {
			throw new Error('Unable to login');
		}
		return user;
	}
);

export const User = model<IUser, UserModel>('User', userSchema);
