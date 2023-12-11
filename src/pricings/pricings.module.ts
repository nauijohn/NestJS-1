import { Module } from '@nestjs/common';

import { PricingFlightsModule } from './flights/pricing-flights.module';
import { PricingHotelsModule } from './hotels/pricing-hotels.module';

@Module({
  imports: [PricingFlightsModule, PricingHotelsModule],
  exports: [PricingFlightsModule, PricingHotelsModule],
})
export class PricingsModule {}
