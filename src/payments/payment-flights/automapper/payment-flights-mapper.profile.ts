import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePaymentFlightRequestDto } from '../dtos/request/create-payment-flight-request.dto';
import { UpdatePaymentFlightRequestDto } from '../dtos/request/update-payment-flight-request.dto';
import { PaymentFlight } from '../payment-flight.entity';

@Injectable()
export class PaymentFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePaymentFlightRequestDto,
        PaymentFlight,
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
        UpdatePaymentFlightRequestDto,
        PaymentFlight,
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
