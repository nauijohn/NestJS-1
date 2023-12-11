import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HTTP_TBO_HOTELS_TIMEOUT } from '../../../../config/config.constant';
import { UtilsModule } from '../../../../utils/utils.module';
import { TboHotelsController } from './tbo-hotels.controller';
import { TboHotelsService } from './tbo-hotels.service';

@Module({
  imports: [
    UtilsModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timeout: +configService.get(HTTP_TBO_HOTELS_TIMEOUT),
      }),
    }),
  ],
  controllers: [TboHotelsController],
  providers: [TboHotelsService],
  exports: [TboHotelsService],
})
export class TboHotelsModule {}
