import { CacheModule } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REDIS_TTL } from '../config/config.constant';
import { MystiflyFlightUtilsModule } from '../providers/mystifly/flight-utils/mystifly-flight-utils.module';
import { UtilsModule } from '../utils/utils.module';
import { CredentialsMapperProfile } from './automapper/credentials-mapper.profile';
import { Credential } from './credential.entity';
import { CredentialsController } from './credentials.controller';
import { CredentialsRepository } from './credentials.repository';
import { CredentialsService } from './credentials.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: +configService.get(REDIS_TTL),
      }),
    }),
    TypeOrmModule.forFeature([Credential]),
    UtilsModule,
    ConfigModule,
    // forwardRef(() => ProvidersModule),
    forwardRef(() => MystiflyFlightUtilsModule),
  ],
  controllers: [CredentialsController],
  providers: [
    CredentialsService,
    CredentialsRepository,
    CredentialsMapperProfile,
  ],
  exports: [CredentialsService],
})
export class CredentialsModule {}
