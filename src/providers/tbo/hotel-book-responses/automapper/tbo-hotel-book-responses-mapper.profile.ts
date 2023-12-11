import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateTboHotelBookResponseRequestDto } from '../dtos/request/create-tbo-hotel-book-response-request.dto';
import { UpdateTboHotelBookResponseRequestDto } from '../dtos/request/update-tbo-hotel-book-response-request.dto';
import { TboHotelBookResponse } from '../tbo-hotel-book-response.entity';

@Injectable()
export class TboHotelBookResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateTboHotelBookResponseRequestDto,
        TboHotelBookResponse,
      );

      createMap(
        mapper,
        UpdateTboHotelBookResponseRequestDto,
        TboHotelBookResponse,
      );
    };
  }
}
