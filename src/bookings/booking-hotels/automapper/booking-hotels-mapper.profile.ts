import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { BookingHotel } from '../booking-hotel.entity';
import { CreateBookingHotelRequestDto } from '../dtos/request/create-booking-hotel-request.dto';
import { UpdateBookingHotelRequestDto } from '../dtos/request/update-booking-hotel-request.dto';

@Injectable()
export class BookingHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateBookingHotelRequestDto, BookingHotel);
      createMap(mapper, UpdateBookingHotelRequestDto, BookingHotel);
    };
  }
}
