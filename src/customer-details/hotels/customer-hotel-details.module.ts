import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { CustomerHotelDetailsMapperProfile } from './automapper/customer-hotel-details-mapper.profile';
import { CustomerHotelDetail } from './customer-hotel-detail.entity';
import { CustomerHotelDetailsController } from './customer-hotel-details.controller';
import { CustomerHotelDetailsRepository } from './customer-hotel-details.repository';
import { CustomerHotelDetailsService } from './customer-hotel-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerHotelDetail]), UtilsModule],
  controllers: [CustomerHotelDetailsController],
  providers: [
    CustomerHotelDetailsService,
    CustomerHotelDetailsRepository,
    CustomerHotelDetailsMapperProfile,
  ],
  exports: [CustomerHotelDetailsService],
})
export class CustomerHotelDetailsModule {}
