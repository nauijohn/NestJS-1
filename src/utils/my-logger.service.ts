import { Request } from 'express';

import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import { INQUIRER, REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLoggerService extends ConsoleLogger implements LoggerService {
  private readonly requestId = this.request
    ? `[${this.request.headers.requestId}]`
    : '';
  private readonly url = this.request
    ? `[${this.request.method} ${this.request.originalUrl}]`
    : '';
  private readonly parentClassName = `[${this.parentClass?.constructor?.name}]`;
  constructor(
    @Inject(INQUIRER) private readonly parentClass: object,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    super();
  }

  log(message: any, data?: any) {
    if (typeof data === 'object') data = JSON.stringify(data, null, 2);
    const context = data ? `${message}${data}` : message;
    super.log(
      `${this.colorize(this.requestId, 'verbose')}${this.colorize(
        this.url,
        'debug',
      )}${this.colorize(this.parentClassName, 'warn')} ${this.colorize(
        context,
        'log',
      )}`,
    );
  }

  verbose(message: any, data?: any) {
    if (typeof data === 'object') data = JSON.stringify(data, null, 2);
    const context = data ? `${message}${data}` : message;
    super.verbose(
      `${this.colorize(this.requestId, 'verbose')}${this.colorize(
        this.url,
        'debug',
      )}${this.colorize(this.parentClassName, 'warn')} ${this.colorize(
        context,
        'verbose',
      )}`,
    );
  }

  debug(message: any, data?: any) {
    if (typeof data === 'object') data = JSON.stringify(data, null, 2);

    const context = data ? `${message}${data}` : message;
    super.debug(
      `${this.colorize(this.requestId, 'verbose')}${this.colorize(
        this.url,
        'debug',
      )}${this.colorize(this.parentClassName, 'warn')} ${this.colorize(
        context,
        'debug',
      )}`,
    );
  }

  warn(message: any, data?: any) {
    if (typeof data === 'object') data = JSON.stringify(data, null, 2);
    const context = data ? `${message}${data}` : message;
    super.warn(
      `${this.colorize(this.requestId, 'verbose')}${this.colorize(
        this.url,
        'debug',
      )}${this.colorize(this.parentClassName, 'warn')} ${this.colorize(
        context,
        'warn',
      )}`,
    );
  }

  error(message: any, data?: any) {
    if (typeof data === 'object') data = JSON.stringify(data, null, 2);
    const context = data ? `${message}${data}` : message;
    super.error(
      `${this.colorize(this.requestId, 'verbose')}${this.colorize(
        this.url,
        'debug',
      )}${this.colorize(this.parentClassName, 'warn')} ${this.colorize(
        context,
        'error',
      )}`,
    );
  }
}
