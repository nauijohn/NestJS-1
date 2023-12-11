import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CustomerFlightDetail } from '../customer-flight-detail.entity';
import { CreateCustomerFlightDetailRequestDto } from '../dtos/request/create-customer-flight-detail-request.dto';

@Injectable()
export class CustomerFlightDetailsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCustomerFlightDetailRequestDto,
        CustomerFlightDetail,
        forMember(
          (destination) => destination.name,
          mapFrom((source) => source.name),
        ),
        forMember(
          (destination) => destination.email,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.mobileNumber,
          mapFrom((source) => source.mobileNumber),
        ),
      );
    };
  }
}
