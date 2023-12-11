import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { IS_PUBLIC_FROM_REFRESH_TOKEN_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.loggerService.log('START RefreshTokenGuard canActivate...');

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_FROM_REFRESH_TOKEN_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    this.loggerService.log('END RefreshTokenGuard canActivate...');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.loggerService.log('START RefreshTokenGuard handleRequest...');

    if (info) this.loggerService.verbose(`info: ${info}`);
    if (user) this.loggerService.debug('user: ', user);
    if (err) this.errorHandlerService.unauthorizedException(err);
    if (!user) this.errorHandlerService.unauthorizedException();

    this.loggerService.log('END RefreshTokenGuard handleRequest...');
    return user;
  }
}
