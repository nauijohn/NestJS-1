import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsModule } from '../../utils/utils.module';
import { TravelerDetailsMapperProfile } from './automapper/traveler-details-mapper.profile';
import { TravelerDetail, TravelerDetailSchema } from './traveler-detail.schema';
import { TravelerDetailsController } from './traveler-details.controller';
import { TravelerDetailsRepository } from './traveler-details.repository';
import { TravelerDetailsService } from './traveler-details.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelerDetail.name, schema: TravelerDetailSchema },
    ]),
    UtilsModule,
  ],
  controllers: [TravelerDetailsController],
  providers: [
    TravelerDetailsService,
    TravelerDetailsRepository,
    TravelerDetailsMapperProfile,
  ],
  exports: [TravelerDetailsService],
})
export class TravelerDetailsModule {}
