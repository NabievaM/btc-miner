import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { JwtPayload, JwtPayloadWithRefreshToken } from '../types';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
  console.log(req.cookies);

  if (req && req.cookies) {
    return req.cookies['refresh_token'];
  }
  return null;
};

@Injectable()
export class RefreshTokenFromCookieStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    console.log(1);

    const refreshToken = req.cookies.refresh_token;
    console.log('Hello from cookie');
    if (!refreshToken) throw new ForbiddenException('Неверный refresh токен');
    return {
      ...payload,
      refreshToken,
    };
  }
}
