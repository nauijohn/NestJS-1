import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerHotelDetailsModule } from '../../customer-details/hotels/customer-hotel-details.module';
import { PaymentHotelsModule } from '../../payments/payment-hotels/payment-hotels.module';
import { TboHotelDetailsModule } from '../../providers/tbo/hotel-details/tbo-hotel-details.module';
import { TransactionHotelsModule } from '../../transactions/hotels/transaction-hotels.module';
import { UtilsModule } from '../../utils/utils.module';
import { BookingHotelsMapperProfile } from './automapper/booking-hotels-mapper.profile';
import { BookingHotel } from './booking-hotel.entity';
import { BookingHotelsController } from './booking-hotels.controller';
import { BookingHotelsRepository } from './booking-hotels.repository';
import { BookingHotelsService } from './booking-hotels.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingHotel]),
    UtilsModule,
    PaymentHotelsModule,
    TransactionHotelsModule,
    CustomerHotelDetailsModule,
    TboHotelDetailsModule,
  ],
  controllers: [BookingHotelsController],
  providers: [
    BookingHotelsService,
    BookingHotelsRepository,
    BookingHotelsMapperProfile,
  ],
  exports: [BookingHotelsService],
})
export class BookingHotelsModule {}
