import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { CustomerFlightDetailsMapperProfile } from './automapper/customer-flight-details-mapper.profile';
import { CustomerFlightDetail } from './customer-flight-detail.entity';
import { CustomerFlightDetailsController } from './customer-flight-details.controller';
import { CustomerFlightDetailsRepository } from './customer-flight-details.repository';
import { CustomerFlightDetailsService } from './customer-flight-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerFlightDetail]), UtilsModule],
  controllers: [CustomerFlightDetailsController],
  providers: [
    CustomerFlightDetailsService,
    CustomerFlightDetailsRepository,
    CustomerFlightDetailsMapperProfile,
  ],
  exports: [CustomerFlightDetailsService],
})
export class CustomerFlightDetailsModule {}
