import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePricingFlightRequestDto } from '../dtos/request/create-pricing-flight-request.dto';
import { UpdatePricingFlightRequestDto } from '../dtos/request/update-pricing-flight-request.dto';
import { PricingFlight } from '../pricing-flight.entity';

@Injectable()
export class PricingFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePricingFlightRequestDto,
        PricingFlight,
        forMember(
          (destination) => destination.cabinClass,
          mapFrom((source) => source.cabinClass),
        ),
        forMember(
          (destination) => destination.fixedAmount,
          mapFrom((source) => source.fixedAmount),
        ),
        forMember(
          (destination) => destination.iataCode,
          mapFrom((source) => source.iataCode),
        ),
        forMember(
          (destination) => destination.percentage,
          mapFrom((source) => source.percentage),
        ),
        forMember(
          (destination) => destination.priceMargin,
          mapFrom((source) => source.priceMargin),
        ),
      );

      createMap(
        mapper,
        UpdatePricingFlightRequestDto,
        PricingFlight,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.cabinClass,
          mapFrom((source) => source.cabinClass),
        ),
        forMember(
          (destination) => destination.fixedAmount,
          mapFrom((source) => source.fixedAmount),
        ),
        forMember(
          (destination) => destination.iataCode,
          mapFrom((source) => source.iataCode),
        ),
        forMember(
          (destination) => destination.percentage,
          mapFrom((source) => source.percentage),
        ),
        forMember(
          (destination) => destination.priceMargin,
          mapFrom((source) => source.priceMargin),
        ),
      );
    };
  }
}
