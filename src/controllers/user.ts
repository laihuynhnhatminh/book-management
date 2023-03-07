import { Request, Response } from 'express';
import { User } from '../models/user';

import UnauthorizeError from '../errors/unauthorize-error';

class UserController {
  async userLogin(req: Request, res: Response): Promise<void> {
    const user = await User.findByCredential(req.body.email, req.body.password);

    if (user.enabled === false) {
      throw new UnauthorizeError();
    }

    const token = await user.generateAuthToken();
    res.send({ success: true, data: { token } });
  }
}

export const userController = new UserController();
