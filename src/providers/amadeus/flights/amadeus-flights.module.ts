import { Module } from '@nestjs/common';

import { UtilsModule } from '../../../utils/utils.module';
import { AmadeusFlightsController } from './amadeus-flights.controller';
import { AmadeusFlightsService } from './amadeus-flights.service';

@Module({
  imports: [UtilsModule],
  controllers: [AmadeusFlightsController],
  providers: [AmadeusFlightsService],
  exports: [AmadeusFlightsService],
})
export class AmadeusFlightsModule {}
