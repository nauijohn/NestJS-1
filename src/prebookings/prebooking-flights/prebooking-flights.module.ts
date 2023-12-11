import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MystiflyModule } from '../../providers/mystifly/mystifly.module';
import { TransactionFlightsModule } from '../../transactions/flights/transaction-flights.module';
import { UtilsModule } from '../../utils/utils.module';
import { PrebookingFlightsMapperProfile } from './automapper/prebooking-flights-mapper.profile';
import { PrebookingFlight } from './prebooking-flight.entity';
import { PrebookingFlightsController } from './prebooking-flights.controller';
import { PrebookingFlightsRepository } from './prebooking-flights.repository';
import { PrebookingFlightsService } from './prebooking-flights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrebookingFlight]),
    UtilsModule,
    TransactionFlightsModule,
    MystiflyModule,
  ],
  controllers: [PrebookingFlightsController],
  providers: [
    PrebookingFlightsService,
    PrebookingFlightsRepository,
    PrebookingFlightsMapperProfile,
  ],
  exports: [PrebookingFlightsService],
})
export class PrebookingFlightsModule {}
