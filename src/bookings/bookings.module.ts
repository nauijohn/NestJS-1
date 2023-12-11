import { Module } from '@nestjs/common';

import { BookingFlightsModule } from './booking-flights/booking-flights.module';
import { BookingHotelsModule } from './booking-hotels/booking-hotels.module';

@Module({
  imports: [BookingHotelsModule, BookingFlightsModule],
  exports: [BookingHotelsModule, BookingFlightsModule],
})
export class BookingsModule {}
