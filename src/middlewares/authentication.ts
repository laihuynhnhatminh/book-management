import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from '../models/user';
import { UserRoleEnum } from '../utils/common/enum';
interface IJWTPayload {
  _id: string;
}

class HandleAuthentication {
  public async userAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!authToken) {
      next();
      return;
    }
    const decoded = jsonwebtoken.verify(
      authToken as string,
      process.env.JWT_SECRET_KEY as string
    );
    const userId = decoded as IJWTPayload;

    const user = await User.findOne({
      _id: userId._id
    });

    if (user && user.enabled === true) {
      req.authToken = authToken;
      req.user = user;
    }
    next();
  }

  public async getUserRole(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    req.userRole = UserRoleEnum.GUEST;
    if (req.user) {
      const user = await User.aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'role_id',
            foreignField: '_id',
            as: 'role'
          }
        },
        { $project: { _id: 1, email: 1, role: 1 } },
        { $unwind: '$role' }
      ]).match({ _id: req.user._id });
      req.userRole = user[0].role.name;
    }
    next();
  }
}

export const handleAuthentication = new HandleAuthentication();
