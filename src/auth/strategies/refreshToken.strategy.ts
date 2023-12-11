import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { JWT_REFRESH_TOKEN_SECRET } from '../../config/config.constant';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private readonly logger = new Logger('RefreshTokenStrategy');

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  validate(req: Request, jwtPayload: any) {
    this.logger.log('START validate...');
    delete jwtPayload.iat;
    delete jwtPayload.exp;
    const userPayload = jwtPayload;
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    this.logger.log('END validate...');
    return { ...userPayload, refreshToken };
  }
}
