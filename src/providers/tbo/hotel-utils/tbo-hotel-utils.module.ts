import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UtilsModule } from '../../../utils/utils.module';
import { TboHotelsModule } from './hotels/tbo-hotels.module';
import { TboHotelUtilsController } from './tbo-hotel-utils.controller';
import { TboHotelUtilsService } from './tbo-hotel-utils.service';

@Module({
  imports: [TboHotelsModule, HttpModule, UtilsModule],
  controllers: [TboHotelUtilsController],
  providers: [TboHotelUtilsService],
  exports: [TboHotelsModule, TboHotelUtilsService],
})
export class TboHotelUtilsModule {}
