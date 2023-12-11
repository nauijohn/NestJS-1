import { Profile, Strategy } from 'passport-facebook';

import {
  Injectable,
  Logger,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_REDIRECT_URL,
} from '../../config/config.constant';
import { AuthService } from '../auth.service';
import { SignAs } from '../enums/sign-as.enum';

interface UserRequestPayload {
  id: string;
  email: string;
  roles: string[];
  signAs: SignAs;
}

@Injectable()
export class FacebookStrategy
  extends PassportStrategy(Strategy, 'facebook')
  implements OnModuleInit
{
  private readonly logger = new Logger('FacebookStrategy');
  private authService: AuthService;

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      clientID: configService.get(FACEBOOK_CLIENT_ID),
      clientSecret: configService.get(FACEBOOK_CLIENT_SECRET),
      callbackURL: configService.get(FACEBOOK_REDIRECT_URL),
      scope: ['email'],
      profileFields: [
        'profileUrl',
        'displayName',
        'name',
        'emails',
        'birthday',
        'gender',
        'photos',
      ],
    });
  }

  async onModuleInit() {
    this.authService = await this.moduleRef.resolve(
      AuthService,
      ContextIdFactory.create(),
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    this.logger.log('START FacebookStrategy validate...');

    console.log('accessToken: ', accessToken);
    console.log('profile: ', profile);

    const email = await this.authService.isEmailExists(profile.emails[0].value);
    console.log('email: ', email);

    if (email.isEmailExists && email.signAs === SignAs.LocalUser)
      throw new UnprocessableEntityException({
        message: 'Account Already Exists',
        email: profile.emails[0].value,
      });

    const user = await this.authService.validateUserForFacebookStrategy(
      profile,
    );

    const userPayload: UserRequestPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      signAs: SignAs.FacebookUser,
    };

    return userPayload;
  }
}
