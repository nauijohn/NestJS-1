import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REDIS_TTL } from '../../config/config.constant';
import { UtilsModule } from '../../utils/utils.module';
import { PricingHotelsMapperProfile } from './automapper/pricing-hotels-mapper.profile';
import { PricingHotel } from './pricing-hotel.entity';
import { PricingHotelsController } from './pricing-hotels.controller';
import { PricingHotelsRepository } from './pricing-hotels.repository';
import { PricingHotelsService } from './pricing-hotels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingHotel]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: +configService.get(REDIS_TTL),
      }),
    }),
    UtilsModule,
  ],
  controllers: [PricingHotelsController],
  providers: [
    PricingHotelsService,
    PricingHotelsRepository,
    PricingHotelsMapperProfile,
  ],
  exports: [PricingHotelsService],
})
export class PricingHotelsModule {}
