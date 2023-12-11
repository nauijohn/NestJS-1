import { Injectable, Logger } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportSerializer } from '@nestjs/passport';

import { FacebookUserDto } from '../users/facebook-users/dtos/facebook-user.dto';
import { FacebookUsersService } from '../users/facebook-users/facebook-users.service';
import { LocalUserDto } from '../users/local-users/dtos/local-user.dto';
import { LocalUsersService } from '../users/local-users/local-users.service';
import { SignAs } from './enums/sign-as.enum';

interface FacebookUserSerialize extends FacebookUserDto {
  signAs: SignAs;
}

interface LocalUserSerialize extends LocalUserDto {
  signAs: SignAs;
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger('SessionSerializer');

  constructor(
    // private readonly localUsersService: LocalUsersService,
    // private readonly facebookUsersService: FacebookUsersService,
    private readonly moduleRef: ModuleRef,
  ) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    this.logger.log('START SessionSerializer serializeUser...');
    this.logger.debug(`user :${JSON.stringify(user)}`);
    this.logger.log('END SessionSerializer serializeUser...');
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ) {
    this.logger.log('START SessionSerializer deserializeUser...');
    this.logger.debug('payload: ', payload);

    let usersService: LocalUsersService | FacebookUsersService = null;
    let user: FacebookUserSerialize | LocalUserSerialize = null;
    switch (payload.signAs) {
      case SignAs.LocalUser:
        usersService = await this.moduleRef.resolve(
          LocalUsersService,
          ContextIdFactory.create(),
          { strict: false },
        );
        user = {
          ...(await usersService.findById(payload.id)),
          signAs: SignAs.LocalUser,
        };
        break;
      case SignAs.FacebookUser:
        usersService = await this.moduleRef.resolve(
          FacebookUsersService,
          ContextIdFactory.create(),
          { strict: false },
        );
        user = {
          ...(await usersService.findById(payload.id)),
          signAs: SignAs.FacebookUser,
        };
        break;
      default:
        usersService = await this.moduleRef.resolve(
          LocalUsersService,
          ContextIdFactory.create(),
          { strict: false },
        );
        user = {
          ...(await usersService.findById(payload.id)),
          signAs: SignAs.LocalUser,
        };
        break;
    }

    this.logger.debug(`user: ${JSON.stringify(user)}`);
    this.logger.log('END SessionSerializer deserializeUser...');
    done(null, user);
  }
}
