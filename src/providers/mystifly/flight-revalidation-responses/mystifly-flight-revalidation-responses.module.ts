import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionFlightsModule } from '../../../transactions/flights/transaction-flights.module';
import { UtilsModule } from '../../../utils/utils.module';
import { MystiflyFlightRevalidationResponsesMapperProfile } from './automapper/mystifly-flight-revalidation-responses-mapper.profile';
import { MystiflyFlightRevalidationResponse } from './mystifly-flight-revalidation-response.entity';
import { MystiflyFlightRevalidationResponsesController } from './mystifly-flight-revalidation-responses.controller';
import { MystiflyFlightRevalidationResponsesRepository } from './mystifly-flight-revalidation-responses.repository';
import { MystiflyFlightRevalidationResponsesService } from './mystifly-flight-revalidation-responses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MystiflyFlightRevalidationResponse]),
    UtilsModule,
    TransactionFlightsModule,
  ],
  controllers: [MystiflyFlightRevalidationResponsesController],
  providers: [
    MystiflyFlightRevalidationResponsesService,
    MystiflyFlightRevalidationResponsesRepository,
    MystiflyFlightRevalidationResponsesMapperProfile,
  ],
  exports: [MystiflyFlightRevalidationResponsesService],
})
export class MystiflyFlightRevalidationResponsesModule {}
