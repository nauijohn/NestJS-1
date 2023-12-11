import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateIataCodeRequestDto } from '../dtos/request/create-iata-code-request.dto';
import { UpdateIataCodeRequestDto } from '../dtos/request/update-iata-code-request.dto';
import { IataCode } from '../iata-code.entity';

@Injectable()
export class IataCodesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateIataCodeRequestDto,
        IataCode,
        forMember(
          (destination) => destination.iataCode,
          mapFrom((source) => source.iataCode),
        ),
      );

      createMap(
        mapper,
        UpdateIataCodeRequestDto,
        IataCode,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.iataCode,
          mapFrom((source) => source.iataCode),
        ),
      );
    };
  }
}
