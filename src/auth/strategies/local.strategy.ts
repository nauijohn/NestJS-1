import { Strategy } from 'passport-local';

import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';
import { SignAs } from '../enums/sign-as.enum';

interface UserRequestPayload {
  id: string;
  email: string;
  roles: string[];
  signAs: SignAs;
}

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private readonly logger = new Logger('LocalStrategy');
  private authService: AuthService;

  constructor(private readonly moduleRef: ModuleRef) {
    super({ usernameField: 'email' });
  }

  async onModuleInit() {
    this.authService = await this.moduleRef.resolve(
      AuthService,
      ContextIdFactory.create(),
    );
  }

  async validate(email: string, password: string) {
    this.logger.log('START validate...');
    const user = await this.authService.validateUserForLocalStrategy(
      email,
      password,
    );
    this.logger.debug(`user: ${JSON.stringify(user)}`);
    if (!user) {
      const error = new UnauthorizedException();
      this.logger.error(error);
      throw error;
    }
    this.logger.debug(`user: ${JSON.stringify(user)}`);
    const userPayload: UserRequestPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      signAs: SignAs.LocalUser,
    };
    this.logger.log('END validate...');
    return userPayload;
  }
}
