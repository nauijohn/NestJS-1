import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { PaymentHotelsMapperProfile } from './automapper/payment-hotels-mapper.profile';
import { PaymentHotel } from './payment-hotel.entity';
import { PaymentHotelsController } from './payment-hotels.controller';
import { PaymentHotelsRepository } from './payment-hotels.repository';
import { PaymentHotelsService } from './payment-hotels.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentHotel]), UtilsModule],
  controllers: [PaymentHotelsController],
  providers: [
    PaymentHotelsService,
    PaymentHotelsRepository,
    PaymentHotelsMapperProfile,
  ],
  exports: [PaymentHotelsService],
})
export class PaymentHotelsModule {}
