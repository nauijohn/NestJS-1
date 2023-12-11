import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  namingConventions,
  PascalCaseNamingConvention,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateTboHotelPrebookResponseRequestDto } from '../dtos/request/create-tbo-hotel-prebook-response-request.dto';
import { TboHotelPrebookResponse } from '../tbo-hotel-prebook-response.entity';

@Injectable()
export class TboHotelPrebookResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateTboHotelPrebookResponseRequestDto,
        TboHotelPrebookResponse,
        namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination.quantity,
          mapFrom((source) => source.quantity),
        ),
        forMember(
          (destination) => destination.rooms,
          mapFrom((source) => source.Rooms),
        ),
        forMember(
          (destination) => destination.rateConditions,
          mapFrom((source) => source.RateConditions),
        ),
      );
    };
  }
}
