import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionFlightsModule } from '../../../transactions/flights/transaction-flights.module';
import { UtilsModule } from '../../../utils/utils.module';
import { MystiflyFlightFareRulesResponsesMapperProfile } from './automapper/mystifly-flight-fare-rules-responses-mapper.profile';
import { MystiflyFlightFareRulesResponse } from './mystifly-flight-fare-rules-response.entity';
import { MystiflyFlightFareRulesResponsesController } from './mystifly-flight-fare-rules-responses.controller';
import { MystiflyFlightFareRulesResponsesRepository } from './mystifly-flight-fare-rules-responses.repository';
import { MystiflyFlightFareRulesResponsesService } from './mystifly-flight-fare-rules-responses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MystiflyFlightFareRulesResponse]),
    UtilsModule,
    TransactionFlightsModule,
  ],
  controllers: [MystiflyFlightFareRulesResponsesController],
  providers: [
    MystiflyFlightFareRulesResponsesService,
    MystiflyFlightFareRulesResponsesRepository,
    MystiflyFlightFareRulesResponsesMapperProfile,
  ],
  exports: [MystiflyFlightFareRulesResponsesService],
})
export class MystiflyFlightFareRulesResponsesModule {}
