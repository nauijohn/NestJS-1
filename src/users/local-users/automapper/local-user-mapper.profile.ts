import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { LocalUserDto } from '../dtos/local-user.dto';
import { LocalUser } from '../local-user.schema';

@Injectable()
export class LocalUserMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        LocalUser,
        LocalUserDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.roles,
          mapFrom((source) => source.roles.map((role) => role.role)),
        ),
        forMember(
          (destination) => destination.mobileNumber,
          mapFrom((source) => source.mobileNumber ?? null),
        ),
        forMember(
          (destination) => destination.middleName,
          mapFrom((source) => source.middleName ?? null),
        ),
        forMember(
          (destination) => destination.passwordUpdatedAt,
          mapFrom((source) => new Date(String(source.passwordUpdatedAt))),
        ),
      );
    };
  }
}
