// Interfaces
import { IUser } from '../../src/models/user';

export {};

declare global {
  namespace Express {
    export interface Request {
      authToken?: string;
      user?: IUser;
      userRole?: string;
    }
  }
}
