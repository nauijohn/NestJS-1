import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePaymentHotelsRequestDto } from '../dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from '../dtos/request/update-payment-hotels-request.dto';
import { PaymentHotel } from '../payment-hotel.entity';

@Injectable()
export class PaymentHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePaymentHotelsRequestDto,
        PaymentHotel,
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
        forMember(
          (destination) => destination.discount,
          mapFrom((source) => source.discount),
        ),
        forMember(
          (destination) => destination.name,
          mapFrom((source) => source.name),
        ),
        forMember(
          (destination) => destination.paymentIntentId,
          mapFrom((source) => source.paymentIntentId),
        ),
        forMember(
          (destination) => destination.referenceNumber,
          mapFrom((source) => source.referenceNumber),
        ),
      );
      createMap(
        mapper,
        UpdatePaymentHotelsRequestDto,
        PaymentHotel,
        forMember(
          (destination) => destination.amount,
          mapFrom((source) => source.amount),
        ),
        forMember(
          (destination) => destination.discount,
          mapFrom((source) => source.discount),
        ),
        forMember(
          (destination) => destination.name,
          mapFrom((source) => source.name),
        ),
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.status,
          mapFrom((source) => source.status),
        ),
      );
    };
  }
}
