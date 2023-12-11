import { ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import {
  IS_PUBLIC,
  IS_PUBLIC_FROM_ACCESS_TOKEN_KEY,
} from '../decorators/is-public.decorator';

@Injectable({ scope: Scope.REQUEST })
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.loggerService.log('START AccessTokenGuard canActivate...');
    const request = context.switchToHttp().getRequest();
    const xApiKey = `${this.configService.get('X_API_KEY')}`;

    if (String(request.headers['x-api-key']) === xApiKey) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isPublicFromAccessTokenKey =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_FROM_ACCESS_TOKEN_KEY,
        [context.getHandler(), context.getClass()],
      );
    if (isPublicFromAccessTokenKey) return true;

    // ! Leave for now for integration
    // ! const request = context.switchToHttp().getRequest();
    // ! this.loggerService.debug(`isAuthenticated: ${request.isAuthenticated()}`);
    // ! if (!request.isAuthenticated()) return false;

    this.loggerService.log('END AccessTokenGuard canActivate...');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.loggerService.log('START AccessTokenGuard handleRequest...');

    if (info) this.loggerService.verbose(`info: ${info}`);
    if (user) this.loggerService.debug('user: ', user);
    if (err) this.errorHandlerService.unauthorizedException(err);
    if (!user) this.errorHandlerService.unauthorizedException();

    this.loggerService.log('END AccessTokenGuard handleRequest...');
    return user;
  }
}
