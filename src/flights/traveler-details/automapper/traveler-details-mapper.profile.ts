import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import { TravelerDetailDto } from '../dtos/traveler-detail.dto';
import { TravelerDetail } from '../traveler-detail.schema';

export class TravelerDetailsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        TravelerDetail,
        TravelerDetailDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (desination) => desination.user,
          mapFrom((source) => source.user),
        ),
      );
    };
  }
}
