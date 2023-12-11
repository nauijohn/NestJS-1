import { Module } from '@nestjs/common';

import { ErrorHandlerService } from './error-handler.service';
import { MyLoggerService } from './my-logger.service';
import { UtilsService } from './utils.service';

@Module({
  providers: [MyLoggerService, ErrorHandlerService, UtilsService],
  exports: [MyLoggerService, ErrorHandlerService, UtilsService],
})
export class UtilsModule {}
