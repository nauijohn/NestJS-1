import { Module } from '@nestjs/common';

import { OneWayModule } from './one-way/one-way.module';
import { PassengerDetailsModule } from './passenger-details/passenger-details.module';
import { RoundtripModule } from './roundtrip/roundtrip.module';
import { TravelerDetailsModule } from './traveler-details/traveler-details.module';

@Module({
  imports: [
    OneWayModule,
    RoundtripModule,
    TravelerDetailsModule,
    PassengerDetailsModule,
  ],
  exports: [
    OneWayModule,
    RoundtripModule,
    TravelerDetailsModule,
    PassengerDetailsModule,
  ],
})
export class FlightsModule {}
