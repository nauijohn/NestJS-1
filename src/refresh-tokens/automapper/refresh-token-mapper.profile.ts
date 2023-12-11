import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshToken } from '../refresh-token.schema';

export class RefreshTokenMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        RefreshToken,
        RefreshTokenDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}
