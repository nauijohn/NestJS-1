import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePricingHotelRequestDto } from '../dtos/request/create-pricing-hotel-request.dto';
import { UpdatePricingHotelRequestDto } from '../dtos/request/update-pricing-hotel-request.dto';
import { PricingHotel } from '../pricing-hotel.entity';

@Injectable()
export class PricingHotelsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePricingHotelRequestDto,
        PricingHotel,
        forMember(
          (destination) => destination.fixedAmount,
          mapFrom((source) => source.fixedAmount),
        ),
        forMember(
          (destination) => destination.percentage,
          mapFrom((source) => source.percentage),
        ),
        forMember(
          (destination) => destination.priceMargin,
          mapFrom((source) => source.priceMargin),
        ),
        forMember(
          (destination) => destination.rating,
          mapFrom((source) => source.rating),
        ),
      );

      createMap(
        mapper,
        UpdatePricingHotelRequestDto,
        PricingHotel,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.fixedAmount,
          mapFrom((source) => source.fixedAmount),
        ),
        forMember(
          (destination) => destination.percentage,
          mapFrom((source) => source.percentage),
        ),
        forMember(
          (destination) => destination.priceMargin,
          mapFrom((source) => source.priceMargin),
        ),
        forMember(
          (destination) => destination.rating,
          mapFrom((source) => source.rating),
        ),
      );
    };
  }
}
