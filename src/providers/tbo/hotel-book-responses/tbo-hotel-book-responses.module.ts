import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../../utils/utils.module';
import { TboHotelBookResponsesMapperProfile } from './automapper/tbo-hotel-book-responses-mapper.profile';
import { TboHotelBookResponse } from './tbo-hotel-book-response.entity';
import { TboHotelBookResponsesController } from './tbo-hotel-book-responses.controller';
import { TboHotelBookResponsesRepository } from './tbo-hotel-book-responses.repository';
import { TboHotelBookResponsesService } from './tbo-hotel-book-responses.service';

@Module({
  imports: [TypeOrmModule.forFeature([TboHotelBookResponse]), UtilsModule],
  controllers: [TboHotelBookResponsesController],
  providers: [
    TboHotelBookResponsesService,
    TboHotelBookResponsesRepository,
    TboHotelBookResponsesMapperProfile,
  ],
  exports: [TboHotelBookResponsesService],
})
export class TboHotelBookResponsesModule {}
