import { AxiosError } from 'axios';

import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(AxiosError)
export class AxiosErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('AxiosErrorExceptionFilter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: AxiosError, host: ArgumentsHost): void {
    this.logger.verbose('catching AxiosErrorExceptionFilter...');

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.logger.error(exception);

    const httpStatus = exception.response ? exception.response.status : 500;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: exception.response ? exception.response.data : exception.message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
