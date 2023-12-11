import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../../utils/utils.module';
import { MystiflyFlightDetailsMapperProfile } from './automapper/mystifly-flight-details-mapper.profile';
import { MystiflyFlightDetail } from './mystifly-flight-detail.entity';
import { MystiflyFlightDetailsController } from './mystifly-flight-details.controller';
import { MystiflyFlightDetailsRepository } from './mystifly-flight-details.repository';
import { MystiflyFlightDetailsService } from './mystifly-flight-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([MystiflyFlightDetail]), UtilsModule],
  controllers: [MystiflyFlightDetailsController],
  providers: [
    MystiflyFlightDetailsService,
    MystiflyFlightDetailsRepository,
    MystiflyFlightDetailsMapperProfile,
  ],
  exports: [MystiflyFlightDetailsService],
})
export class MystiflyFlightDetailsModule {}
