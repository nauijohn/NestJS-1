import { Module } from '@nestjs/common';

import { TripninjaFlightsModule } from './flights/tripninja-flights.module';

@Module({
  imports: [TripninjaFlightsModule],
  exports: [TripninjaFlightsModule],
})
export class TripninjaModule {}
