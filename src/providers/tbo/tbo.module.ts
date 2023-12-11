import { Module } from '@nestjs/common';

import { TboHotelBookResponsesModule } from './hotel-book-responses/tbo-hotel-book-responses.module';
import { TboHotelDetailsModule } from './hotel-details/tbo-hotel-details.module';
import { TboHotelPrebookResponsesModule } from './hotel-prebook-responses/tbo-hotel-prebook-responses.module';
import { TboHotelUtilsModule } from './hotel-utils/tbo-hotel-utils.module';

@Module({
  imports: [
    TboHotelUtilsModule,
    TboHotelPrebookResponsesModule,
    TboHotelDetailsModule,
    TboHotelBookResponsesModule,
  ],
  exports: [
    TboHotelUtilsModule,
    TboHotelPrebookResponsesModule,
    TboHotelDetailsModule,
    TboHotelBookResponsesModule,
  ],
})
export class TboModule {}
