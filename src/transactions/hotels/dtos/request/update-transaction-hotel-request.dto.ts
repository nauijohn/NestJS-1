import { AutoMap } from '@automapper/classes';
import { PartialType } from '@nestjs/swagger';

import { BookingHotel } from '../../../../bookings/booking-hotels/booking-hotel.entity';
import { PaymentHotel } from '../../../../payments/payment-hotels/payment-hotel.entity';
import { PrebookingHotel } from '../../../../prebookings/prebooking-hotels/prebooking-hotel.entity';
import { CreateTransactionHotelRequestDto } from './create-transaction-hotel-request.dto';

export class UpdateTransactionHotelRequestDto extends PartialType(
  CreateTransactionHotelRequestDto,
) {
  @AutoMap()
  id: number;

  @AutoMap()
  prebookingHotel?: PrebookingHotel;

  @AutoMap()
  paymentHotel?: PaymentHotel;

  @AutoMap(() => [BookingHotel])
  bookingHotels?: BookingHotel[];
}
