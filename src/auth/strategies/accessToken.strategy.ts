import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import { JWT_ACCESS_TOKEN_SECRET } from '../../config/config.constant';
import { FacebookUsersService } from '../../users/facebook-users/facebook-users.service';
import { LocalUsersService } from '../../users/local-users/local-users.service';
import { SignAs } from '../enums/sign-as.enum';

@Injectable()
export class AccessTokenStrategy
  extends PassportStrategy(Strategy, 'jwt')
  implements OnModuleInit
{
  private readonly logger = new Logger('AccessTokenStrategy');
  private localUsersService: LocalUsersService;
  private facebookUsersService: FacebookUsersService;

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(JWT_ACCESS_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  async onModuleInit() {
    this.localUsersService = await this.moduleRef.resolve(
      LocalUsersService,
      ContextIdFactory.create(),
      { strict: false },
    );
    this.facebookUsersService = await this.moduleRef.resolve(
      FacebookUsersService,
      ContextIdFactory.create(),
      { strict: false },
    );
  }

  async validate(request: Request, jwtPayload: any) {
    this.logger.log('validate...');

    this.logger.debug(`req.user: ${JSON.stringify(request.user)}`);
    this.logger.debug(`jwtPayload: ${JSON.stringify(jwtPayload)}`);

    delete jwtPayload.iat;
    delete jwtPayload.exp;
    let userPayload = jwtPayload;
    if (request.user === undefined) {
      let usersService: LocalUsersService | FacebookUsersService = null;
      switch (userPayload.signAs) {
        case SignAs.LocalUser:
          usersService = await this.moduleRef.resolve(
            LocalUsersService,
            ContextIdFactory.create(),
            { strict: false },
          );
          break;
        case SignAs.FacebookUser:
          usersService = await this.moduleRef.resolve(
            FacebookUsersService,
            ContextIdFactory.create(),
            { strict: false },
          );
          break;
        default:
          usersService = await this.moduleRef.resolve(
            LocalUsersService,
            ContextIdFactory.create(),
            { strict: false },
          );
          break;
      }
    } else {
      userPayload = request.user;
    }
    this.logger.debug(`userPayload: ${JSON.stringify(userPayload)}`);
    return userPayload;
  }
}
