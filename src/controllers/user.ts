import { Request, Response } from 'express';
import { User } from '../models/user';

import CustomError from '../errors/custom-errors';

class UserController {
  async userLogin(req: Request, res: Response): Promise<void> {
    const user = await User.findByCredential(req.body.email, req.body.password);

    if (user.enabled === false) {
      throw new CustomError('No Book Found', 401);
    }

    const token = await user.generateAuthToken();
    res.send({ success: true, data: { token } });
  }
}

export const userController = new UserController();
