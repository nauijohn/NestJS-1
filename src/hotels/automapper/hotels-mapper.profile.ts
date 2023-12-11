import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import {
  TboBookRequestDto,
  TboCustomerName,
} from '../../providers/tbo/hotel-utils/hotels/dtos/request/tbo-book-request.dto';
import { UtilsService } from '../../utils/utils.service';
import {
  BookHotelsCustomerName,
  BookHotelsRequestDto,
} from '../dtos/request/book-hotels-request.dto';

@Injectable()
export class HotelsMapperProfile extends AutomapperProfile {
  private readonly utilsService: UtilsService;
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
    this.utilsService = new UtilsService();
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        BookHotelsRequestDto,
        TboBookRequestDto,
        forMember(
          (destination) => destination.BookingCode,
          mapFrom((source) => source.bookingCode),
        ),
        forMember(
          (destination) => destination.EmailId,
          mapFrom((source) => source.email),
        ),
        forMember(
          (destination) => destination.PhoneNumber,
          mapFrom((source) => source.phoneNumber),
        ),
        forMember(
          (destination) => destination.TotalFare,
          mapFrom((source) => source.totalFare),
        ),
      );

      createMap(
        mapper,
        BookHotelsCustomerName,
        TboCustomerName,
        forMember(
          (destination) => destination.FirstName,
          mapFrom((source) => this.utilsService.pascalize(source.firstName)),
        ),
        forMember(
          (destination) => destination.LastName,
          mapFrom((source) => this.utilsService.pascalize(source.lastName)),
        ),
        forMember(
          (destination) => destination.Title,
          mapFrom((source) => this.utilsService.pascalize(source.title)),
        ),
        forMember(
          (destination) => destination.Type,
          mapFrom((source) => this.utilsService.pascalize(source.type)),
        ),
      );
    };
  }
}
