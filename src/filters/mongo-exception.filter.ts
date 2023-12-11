import { MongoServerError } from 'mongoose/node_modules/mongodb';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(MongoServerError)
export class MongoExceptionFiler implements ExceptionFilter {
  private readonly logger = new Logger('MongoExceptionFiler');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: MongoServerError, host: ArgumentsHost): void {
    this.logger.verbose('catching MongoServerError...');

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.logger.error(exception);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception.errmsg,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
