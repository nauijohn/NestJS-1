import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../../utils/utils.module';
import { TboHotelDetailsMapperProfile } from './automapper/tbo-hotel-details-mapper.profile';
import { TboHotelDetail } from './tbo-hotel-detail.entity';
import { TboHotelDetailsController } from './tbo-hotel-details.controller';
import { TboHotelDetailsRepository } from './tbo-hotel-details.repository';
import { TboHotelDetailsService } from './tbo-hotel-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([TboHotelDetail]), UtilsModule],
  controllers: [TboHotelDetailsController],
  providers: [
    TboHotelDetailsService,
    TboHotelDetailsRepository,
    TboHotelDetailsMapperProfile,
  ],
  exports: [TboHotelDetailsService],
})
export class TboHotelDetailsModule {}
