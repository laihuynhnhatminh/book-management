import { IUser } from 'src/models/user';
import UnauthorizeError from '../errors/unauthorize-error';
import { UserRoleEnum } from '../utils/common/enum';

class AuthValidation {
	public ensureLoggedIn(userRole: string) {
		const allowRoles = [
			UserRoleEnum.USER as string,
			UserRoleEnum.ADMIN as string
		];
		if (!allowRoles.includes(userRole)) {
			throw new UnauthorizeError('Please authenticate');
		}
	}
}

export const authValidation = new AuthValidation();
