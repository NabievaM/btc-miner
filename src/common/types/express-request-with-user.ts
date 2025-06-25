import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    sub: number; 
    email: string;
    iat?: number;
    exp?: number;
  };
}
