import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../../utils/utils.module';
import { TboHotelPrebookResponsesMapperProfile } from './automapper/tbo-hotel-prebook-responses-mapper.profile';
import { TboHotelPrebookResponse } from './tbo-hotel-prebook-response.entity';
import { TboHotelPrebookResponsesController } from './tbo-hotel-prebook-responses.controller';
import { TboHotelPrebookResponsesRepository } from './tbo-hotel-prebook-responses.repository';
import { TboHotelPrebookResponsesService } from './tbo-hotel-prebook-responses.service';

@Module({
  imports: [TypeOrmModule.forFeature([TboHotelPrebookResponse]), UtilsModule],
  controllers: [TboHotelPrebookResponsesController],
  providers: [
    TboHotelPrebookResponsesService,
    TboHotelPrebookResponsesRepository,
    TboHotelPrebookResponsesMapperProfile,
  ],
  exports: [TboHotelPrebookResponsesService],
})
export class TboHotelPrebookResponsesModule {}
