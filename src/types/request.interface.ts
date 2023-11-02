import { Request } from 'express';

export type TUser = {
  email: string;
  id: number;
  roles: string[];
};

export interface MyRequest extends Request {
  user?: TUser;
}
