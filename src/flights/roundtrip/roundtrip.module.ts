import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { REDIS_TTL } from '../../config/config.constant';
import { PricingFlightsModule } from '../../pricings/flights/pricing-flights.module';
import { ProvidersModule } from '../../providers/providers.module';
import { UtilsModule } from '../../utils/utils.module';
import { RoundtripController } from './roundtrip.controller';
import { RoundtripService } from './roundtrip.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: +configService.get(REDIS_TTL),
      }),
    }),
    UtilsModule,
    ProvidersModule,
    PricingFlightsModule,
  ],
  controllers: [RoundtripController],
  providers: [RoundtripService],
  exports: [RoundtripService],
})
export class RoundtripModule {}
