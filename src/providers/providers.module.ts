import { Module } from '@nestjs/common';

import { AggregatesModule } from './aggregates/aggregates.module';
import { AmadeusModule } from './amadeus/amadeus.module';
import { FacebookModule } from './facebook/facebook.module';
import { MystiflyModule } from './mystifly/mystifly.module';
import { PaymongoModule } from './paymongo/paymongo.module';
import { TboModule } from './tbo/tbo.module';
import { TripninjaModule } from './tripninja/tripninja.module';

@Module({
  imports: [
    MystiflyModule,
    TboModule,
    AggregatesModule,
    AmadeusModule,
    TripninjaModule,
    PaymongoModule,
    FacebookModule,
  ],
  exports: [
    MystiflyModule,
    TboModule,
    AggregatesModule,
    AmadeusModule,
    TripninjaModule,
    PaymongoModule,
    FacebookModule,
  ],
})
export class ProvidersModule {}
