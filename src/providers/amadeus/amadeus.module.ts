import { Module } from '@nestjs/common';

import { AmadeusFlightsModule } from './flights/amadeus-flights.module';

@Module({
  imports: [AmadeusFlightsModule],
  exports: [AmadeusFlightsModule],
})
export class AmadeusModule {}
