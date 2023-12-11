import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UtilsModule } from '../../utils/utils.module';
import { AggregatesController } from './aggregates.controller';
import { AggregatesService } from './aggregates.service';

@Module({
  imports: [HttpModule, UtilsModule],
  controllers: [AggregatesController],
  providers: [AggregatesService],
  exports: [AggregatesService],
})
export class AggregatesModule {}
