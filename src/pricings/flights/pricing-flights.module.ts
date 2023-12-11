import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REDIS_TTL } from '../../config/config.constant';
import { IataCodesModule } from '../../iataCodes/iata-codes.module';
import { UtilsModule } from '../../utils/utils.module';
import { PricingFlightsMapperProfile } from './automapper/pricing-flights-mapper.profile';
import { PricingFlight } from './pricing-flight.entity';
import { PricingFlightsController } from './pricing-flights.controller';
import { PricingFlightsRepository } from './pricing-flights.repository';
import { PricingFlightsService } from './pricing-flights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingFlight]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: +configService.get(REDIS_TTL),
      }),
    }),
    UtilsModule,
    IataCodesModule,
  ],
  controllers: [PricingFlightsController],
  providers: [
    PricingFlightsService,
    PricingFlightsRepository,
    PricingFlightsMapperProfile,
  ],
  exports: [PricingFlightsService],
})
export class PricingFlightsModule {}
