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

import { CreateTboHotelDetailRequestDto } from '../dtos/request/create-tbo-hotel-detail-request.dto';
import { TboHotelDetail } from '../tbo-hotel-detail.entity';

@Injectable()
export class TboHotelDetailsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateTboHotelDetailRequestDto,
        TboHotelDetail,
        namingConventions(new PascalCaseNamingConvention()),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
      );
    };
  }
}
