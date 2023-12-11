import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger('TimeoutInterceptor');

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('intercept...');

    const response = context.switchToHttp().getResponse();
    console.log('response: ', response);
    const timeout =
      this.reflector.get<number>('request-timeout', context.getHandler()) ||
      60000;
    console.log('timeout: ', timeout);
    response.setTimeout(timeout);

    console.log('timed-out');

    return next.handle();
  }
}
