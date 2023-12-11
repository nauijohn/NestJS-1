import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestIdMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Initializing requestId for request...');
    this.logger.debug(`req.user: ${JSON.stringify(req.user)}`);
    req.headers.requestId = uuidv4();
    next();
  }
}
