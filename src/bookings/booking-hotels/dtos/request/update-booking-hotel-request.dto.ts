import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { AutoMap } from '@automapper/classes';
import { PartialType } from '@nestjs/swagger';

import { CreateBookingHotelRequestDto } from './create-booking-hotel-request.dto';

export class UpdateBookingHotelRequestDto extends PartialType(
  CreateBookingHotelRequestDto,
) {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}
