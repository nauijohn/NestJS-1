import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateTransactionHotelRequestDto } from '../dtos/request/create-transaction-hotel-request.dto';
import { UpdateTransactionHotelRequestDto } from '../dtos/request/update-transaction-hotel-request.dto';
import { TransactionHotel } from '../transaction-hotel.entity';

@Injectable()
export class TransactionHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateTransactionHotelRequestDto, TransactionHotel);
      createMap(
        mapper,
        UpdateTransactionHotelRequestDto,
        TransactionHotel,
        // forMember(
        //   (destination) => destination.bookingHotels,
        //   mapFrom((source) => source.bookingHotels),
        // ),
        // forMember(
        //   (destination) => destination.paymentHotel,
        //   mapFrom((source) => source.paymentHotel),
        // ),
      );
    };
  }
}
