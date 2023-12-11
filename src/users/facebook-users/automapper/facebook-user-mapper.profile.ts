import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { FacebookUserDto } from '../dtos/facebook-user.dto';
import { FacebookUser } from '../facebook-user.schema';

@Injectable()
export class FacebookUserMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        FacebookUser,
        FacebookUserDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.roles,
          mapFrom((source) => source.roles.map((role) => role.role)),
        ),
      );
    };
  }
}
