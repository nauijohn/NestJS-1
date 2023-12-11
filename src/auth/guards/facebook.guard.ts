import { ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class FacebookGuard extends AuthGuard('facebook') {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.loggerService.log('START FacebookGuard canActivate...');

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.loggerService.log('START FacebookGuard handleRequest...');

    if (user) this.loggerService.debug(`user: ${JSON.stringify(user)}`);

    if (info) {
      if (typeof info === 'object')
        this.loggerService.verbose(`info: ${JSON.stringify(info)}`);
      else this.loggerService.verbose(`info: ${info}`);
    }
    if (!user) this.loggerService.error(`user: ${user}`);
    if (err) this.loggerService.error(`err: ${err}`);
    if (user) this.loggerService.debug('user: ', user);
    if (err) {
      // this.errorHandlerService.unauthorizedException(err);
      console.log('err: ', err);
      throw err;
    }
    if (!user) this.errorHandlerService.unauthorizedException();

    this.loggerService.log('END FacebookGuard handleRequest...');
    return user;
  }
}
