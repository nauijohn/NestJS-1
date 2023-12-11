import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { REDIS_TTL } from '../config/config.constant';
import { ProvidersModule } from '../providers/providers.module';
import { UtilsModule } from '../utils/utils.module';
import { HotelsMapperProfile } from './automapper/hotels-mapper.profile';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: +configService.get(REDIS_TTL),
      }),
    }),
    ProvidersModule,
    UtilsModule,
  ],
  controllers: [HotelsController],
  providers: [HotelsService, HotelsMapperProfile],
  exports: [HotelsService],
})
export class HotelsModule {}
