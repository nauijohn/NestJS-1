import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HTTP_MYSTIFLY_FLIGHTS_TIMEOUT } from '../../../config/config.constant';
import { CredentialsModule } from '../../../credentials/credentials.module';
import { UtilsModule } from '../../../utils/utils.module';
import { MystiflyFlightUtilsController } from './mystifly-flight-utils.controller';
import { MystiflyFlightUtilsService } from './mystifly-flight-utils.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: +configService.get(HTTP_MYSTIFLY_FLIGHTS_TIMEOUT),
      }),
    }),
    UtilsModule,
    forwardRef(() => CredentialsModule),
  ],
  controllers: [MystiflyFlightUtilsController],
  providers: [MystiflyFlightUtilsService],
  exports: [MystiflyFlightUtilsService],
})
export class MystiflyFlightUtilsModule {}
