import { Types } from 'mongoose';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { UserRoleDto } from '../dtos/user-role.dto';
import { UserRole } from '../user-role.schema';

@Injectable()
export class UserRoleMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserRole,
        UserRoleDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
        forMember(
          (destination) => destination.userId,
          mapFrom((source) =>
            source.user != undefined
              ? new Types.ObjectId(source.user._id).toString()
              : null,
          ),
        ),
      );
    };
  }
}
