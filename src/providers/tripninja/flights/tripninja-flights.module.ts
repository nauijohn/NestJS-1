import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AmadeusModule } from '../../../providers/amadeus/amadeus.module';
import { UtilsModule } from '../../../utils/utils.module';
import { TripninjaFlightsController } from './tripninja-flights.controller';
import { TripninjaFlightsService } from './tripninja-flights.service';

@Module({
  imports: [HttpModule, UtilsModule, AmadeusModule],
  controllers: [TripninjaFlightsController],
  providers: [TripninjaFlightsService],
  exports: [TripninjaFlightsService],
})
export class TripninjaFlightsModule {}
