import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { PaymongoEventDto } from '../dtos/paymongo-event.dto';
import { PaymongoEvent } from '../paymongo-event.schema';

@Injectable()
export class PaymongoEventMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        PaymongoEvent,
        PaymongoEventDto,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source._id.toString()),
        ),
      );
    };
  }
}
