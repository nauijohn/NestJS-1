import { Request } from 'express';

import {
  BadRequestException,
  ConflictException,
  ConsoleLogger,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { INQUIRER, REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class ErrorHandlerService
  extends ConsoleLogger
  implements LoggerService
{
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

  internalServerErrorException(message?: any) {
    const error = new InternalServerErrorException(message);
    this.errorHandler(error);
    throw error;
  }

  conflictException(message?: any) {
    const error = new ConflictException(message);
    this.errorHandler(error);
    throw error;
  }

  notFoundException(message?: any) {
    const error = new NotFoundException(message);
    this.errorHandler(error);
    throw error;
  }

  unauthorizedException(message?: any) {
    const error = new UnauthorizedException(message);
    this.errorHandler(error);
    throw error;
  }

  forbiddenException(message?: any) {
    const error = new ForbiddenException(message);
    this.errorHandler(error);
    throw error;
  }

  badRequestException(message?: any) {
    const error = new BadRequestException(message);
    this.errorHandler(error);
    throw error;
  }

  private errorHandler(message: any, data?: any) {
    if (typeof data === 'object') data = JSON.stringify(data, null, 2);
    const context = data ? `${message}${data}` : message;
    this.error(
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
