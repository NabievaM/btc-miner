import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtPayload } from '../../types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, contex: ExecutionContext): number => {
    const request = contex.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    if (!user) throw new ForbiddenException('Неверный токен');
    console.log('user:', user);

    return user.sub;
  },
);
