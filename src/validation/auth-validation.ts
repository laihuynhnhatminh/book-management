import { IUser } from 'src/models/user';
import UnauthorizeError from '../errors/unauthorize-error';
import { UserRoleEnum } from '../utils/common/enum';

class AuthValidation {
  public ensureLoggedIn(userRole: string | undefined, user: IUser | undefined) {
    if (userRole === UserRoleEnum.GUEST) {
      throw new UnauthorizeError('Please authenticate');
    }
    if (!user) {
      throw new UnauthorizeError('Please authenticate');
    }
  }
}

export const authValidation = new AuthValidation();
