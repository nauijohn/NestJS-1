import { Module } from '@nestjs/common';

import { PrebookingFlightsModule } from './prebooking-flights/prebooking-flights.module';
import { PrebookingHotelsModule } from './prebooking-hotels/prebooking-hotels.module';

@Module({
  imports: [PrebookingFlightsModule, PrebookingHotelsModule],
  exports: [PrebookingFlightsModule, PrebookingHotelsModule],
})
export class PrebookingsModule {}
