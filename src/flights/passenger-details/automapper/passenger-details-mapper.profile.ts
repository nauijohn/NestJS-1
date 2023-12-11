import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePassengerDetailRequestDto } from '../dtos/request/create-passenger-detail-request.dto';
import { UpdatePassengerDetailRequestDto } from '../dtos/request/update-passenger-detail-request.dto';
import { PassengerDetail } from '../passenger-detail.entity';

@Injectable()
export class PassengerDetailsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePassengerDetailRequestDto,
        PassengerDetail,
        forMember(
          (destination) => destination.birthDate,
          mapFrom((source) => source.birthDate),
        ),
        forMember(
          (destination) => destination.expirationDate,
          mapFrom((source) => source.expirationDate),
        ),
        forMember(
          (destination) => destination.firstName,
          mapFrom((source) => source.firstName),
        ),
        forMember(
          (destination) => destination.lastName,
          mapFrom((source) => source.lastName),
        ),
        forMember(
          (destination) => destination.middleName,
          mapFrom((source) => source.middleName),
        ),
        forMember(
          (destination) => destination.nationality,
          mapFrom((source) => source.nationality),
        ),
        forMember(
          (destination) => destination.passportNumber,
          mapFrom((source) => source.passportNumber),
        ),
        forMember(
          (destination) => destination.countryIssued,
          mapFrom((source) => source.countryIssued),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => source.title),
        ),
        forMember(
          (destination) => destination.passengerType,
          mapFrom((source) => source.passengerType),
        ),
      );

      createMap(
        mapper,
        UpdatePassengerDetailRequestDto,
        PassengerDetail,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.birthDate,
          mapFrom((source) => source.birthDate),
        ),
        forMember(
          (destination) => destination.expirationDate,
          mapFrom((source) => source.expirationDate),
        ),
        forMember(
          (destination) => destination.firstName,
          mapFrom((source) => source.firstName),
        ),
        forMember(
          (destination) => destination.lastName,
          mapFrom((source) => source.lastName),
        ),
        forMember(
          (destination) => destination.middleName,
          mapFrom((source) => source.middleName),
        ),
        forMember(
          (destination) => destination.nationality,
          mapFrom((source) => source.nationality),
        ),
        forMember(
          (destination) => destination.passportNumber,
          mapFrom((source) => source.passportNumber),
        ),
        forMember(
          (destination) => destination.title,
          mapFrom((source) => source.title),
        ),
        forMember(
          (destination) => destination.passengerType,
          mapFrom((source) => source.passengerType),
        ),
      );
    };
  }
}
