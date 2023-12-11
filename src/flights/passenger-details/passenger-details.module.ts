import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { PassengerDetailsMapperProfile } from './automapper/passenger-details-mapper.profile';
import { PassengerDetail } from './passenger-detail.entity';
import { PassengerDetailsController } from './passenger-details.controller';
import { PassengerDetailsRepository } from './passenger-details.repository';
import { PassengerDetailsService } from './passenger-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerDetail]), UtilsModule],
  controllers: [PassengerDetailsController],
  providers: [
    PassengerDetailsService,
    PassengerDetailsRepository,
    PassengerDetailsMapperProfile,
  ],
  exports: [PassengerDetailsService],
})
export class PassengerDetailsModule {}
