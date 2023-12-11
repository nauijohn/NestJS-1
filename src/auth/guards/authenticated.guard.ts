import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { MyLoggerService } from '../../utils/my-logger.service';
import {
  IS_PUBLIC,
  IS_PUBLIC_FROM_AUTHENTICATED_KEY,
} from '../decorators/is-public.decorator';

@Injectable({ scope: Scope.REQUEST })
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    this.loggerService.log('START AuthenticatedGuard canActivate...');
    const request = context.switchToHttp().getRequest();
    const xApiKey = `${this.configService.get('X_API_KEY')}`;

    if (String(request.headers['x-api-key']) === xApiKey) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const isPublicFromAuthenticated = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_FROM_AUTHENTICATED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicFromAuthenticated) return true;

    // const request = context.switchToHttp().getRequest();
    this.loggerService.debug('isAuthenticated: ', request.isAuthenticated());
    this.loggerService.log('END AuthenticatedGuard canActivate...');
    return request.isAuthenticated();
  }
}
