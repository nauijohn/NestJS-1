import { Module } from '@nestjs/common';

import { CustomerFlightDetailsModule } from './flights/customer-flight-details.module';
import { CustomerHotelDetailsModule } from './hotels/customer-hotel-details.module';

@Module({
  imports: [CustomerFlightDetailsModule, CustomerHotelDetailsModule],
  exports: [CustomerFlightDetailsModule, CustomerHotelDetailsModule],
})
export class CustomerDetailsModule {}
