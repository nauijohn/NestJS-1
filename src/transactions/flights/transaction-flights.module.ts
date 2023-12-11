import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { TransactionFlightsMapperProfile } from './automapper/transaction-flights-mapper.profile';
import { TransactionFlight } from './transaction-flight.entity';
import { TransactionFlightsController } from './transaction-flights.controller';
import { TransactionFlightsRepository } from './transaction-flights.repository';
import { TransactionFlightsService } from './transaction-flights.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionFlight]), UtilsModule],
  controllers: [TransactionFlightsController],
  providers: [
    TransactionFlightsService,
    TransactionFlightsRepository,
    TransactionFlightsMapperProfile,
  ],
  exports: [TransactionFlightsService],
})
export class TransactionFlightsModule {}
