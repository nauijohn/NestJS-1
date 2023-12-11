import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UtilsModule } from '../../utils/utils.module';
import { FacebookController } from './facebook.controller';
import { FacebookService } from './facebook.service';

@Module({
  imports: [HttpModule, UtilsModule],
  controllers: [FacebookController],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}
