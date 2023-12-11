import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UtilsModule } from '../utils/utils.module';
import { NestMailerController } from './nest-mailer.controller';
import { NestMailerService } from './nest-mailer.service';

@Module({
  imports: [UtilsModule, ConfigModule],
  controllers: [NestMailerController],
  providers: [NestMailerService],
  exports: [NestMailerService],
})
export class NestMailerModule {}
