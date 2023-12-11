import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateMystiflyFlightDetailRequestDto } from '../dtos/request/create-mystifly-flight-detail-request.dto';
import { UpdateMystiflyFlightDetailRequestDto } from '../dtos/request/update-mystifly-flight-detail-request.dto';
import { MystiflyFlightDetail } from '../mystifly-flight-detail.entity';

@Injectable()
export class MystiflyFlightDetailsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateMystiflyFlightDetailRequestDto,
        MystiflyFlightDetail,
        forMember(
          (destination) => destination.fareSourceCode,
          mapFrom((source) => source.FareSourceCode),
        ),
        forMember(
          (destination) => destination.flightFares,
          mapFrom((source) => source.FlightFares),
        ),
        forMember(
          (destination) => destination.originDestinations,
          mapFrom((source) => source.OriginDestinations),
        ),
        forMember(
          (destination) => destination.penaltiesInfo,
          mapFrom((source) => source.PenaltiesInfo),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.paymentReferenceNumber,
          mapFrom((source) => source.paymentReferenceNumber),
        ),
        forMember(
          (destination) => destination.validatingCarrier,
          mapFrom((source) => source.ValidatingCarrier),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
      );

      createMap(
        mapper,
        UpdateMystiflyFlightDetailRequestDto,
        MystiflyFlightDetail,
        forMember(
          (destination) => destination.fareSourceCode,
          mapFrom((source) => source.FareSourceCode),
        ),
        forMember(
          (destination) => destination.flightFares,
          mapFrom((source) => source.FlightFares),
        ),
        forMember(
          (destination) => destination.originDestinations,
          mapFrom((source) => source.OriginDestinations),
        ),
        forMember(
          (destination) => destination.penaltiesInfo,
          mapFrom((source) => source.PenaltiesInfo),
        ),
        forMember(
          (destination) => destination.validatingCarrier,
          mapFrom((source) => source.ValidatingCarrier),
        ),
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
      );
    };
  }
}
