import { Request } from 'express';
import UnauthorizeError from '../errors/unauthorize-error';
import { UserRoleEnum } from '../utils/common/enum';

class AuthValidation {
  public ensureLoggedIn(req: Request) {
    if (req.userRole === UserRoleEnum.GUEST) {
      throw new UnauthorizeError('Please authenticate');
    }
  }
}

export const authValidation = new AuthValidation();
