import { QueryFailedError, TypeORMError } from 'typeorm';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  private readonly logger = new Logger('TypeOrmFilter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: TypeORMError, host: ArgumentsHost): void {
    this.logger.verbose('catching TypeORMError...');

    console.log('exception: ', exception);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.logger.error(exception);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message ? exception.message : exception;

    if (exception instanceof QueryFailedError)
      message = exception.driverError.detail
        ? exception.driverError.detail
        : exception.message;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
