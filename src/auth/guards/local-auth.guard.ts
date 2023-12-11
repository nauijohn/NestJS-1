import { ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    this.loggerService.log('START LocalAuthGuard canActivate...');
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);
    this.loggerService.log('END LocalAuthGuard canActivate...');

    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    this.loggerService.log('START LocalAuthGuard handleRequest...');

    if (info) this.loggerService.verbose(`info: ${info}`);
    if (user) this.loggerService.debug('user: ', user);
    if (err) this.loggerService.debug(`err: ${err}`);
    if (err)
      this.errorHandlerService.unauthorizedException({
        statusCode: 401,
        message: 'Unauthorized',
        err,
        info,
      });

    if (!user) this.errorHandlerService.unauthorizedException();

    this.loggerService.log('END LocalAuthGuard handleRequest...');
    return user;
  }
}
