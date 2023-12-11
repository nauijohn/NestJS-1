import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { MyLoggerService } from '../utils/my-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: MyLoggerService) {}

  async use(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const { ip, headers } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    this.loggerService.warn(`START - ${userAgent} ${ip} ${Date.now() - now}ms`);
    response.setHeader('RequestId', headers.requestId);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.loggerService.warn(
        `END ${statusCode} ${contentLength} - ${userAgent} ${ip} ${
          Date.now() - now
        }ms`,
      );
    });

    next();
  }
}
