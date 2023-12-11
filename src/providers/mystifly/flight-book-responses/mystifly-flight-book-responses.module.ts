import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../../utils/utils.module';
import { MystiflyFlightBookResponsesMapperProfile } from './automapper/mystifly-flight-book-responses-mapper.profile';
import { MystiflyFlightBookResponse } from './mystifly-flight-book-response.entity';
import { MystiflyFlightBookResponsesController } from './mystifly-flight-book-responses.controller';
import { MystiflyFlightBookResponsesRepository } from './mystifly-flight-book-responses.repository';
import { MystiflyFlightBookResponsesService } from './mystifly-flight-book-responses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MystiflyFlightBookResponse]),
    UtilsModule,
  ],
  controllers: [MystiflyFlightBookResponsesController],
  providers: [
    MystiflyFlightBookResponsesService,
    MystiflyFlightBookResponsesRepository,
    MystiflyFlightBookResponsesMapperProfile,
  ],
  exports: [MystiflyFlightBookResponsesService],
})
export class MystiflyFlightBookResponsesModule {}
