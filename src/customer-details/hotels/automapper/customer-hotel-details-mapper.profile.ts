import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CustomerHotelDetail } from '../customer-hotel-detail.entity';
import { CreateCustomerHotelDetailRequestDto } from '../dtos/request/create-customer-hotel-detail-request.dto';

@Injectable()
export class CustomerHotelDetailsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCustomerHotelDetailRequestDto,
        CustomerHotelDetail,
      );
    };
  }
}
