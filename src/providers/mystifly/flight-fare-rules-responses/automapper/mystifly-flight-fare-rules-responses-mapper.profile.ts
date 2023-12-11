import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateMystiflyFlightFareRulesResponseRequestDto } from '../dtos/request/create-mystifly-flight-fare-rules-response-request.dto';
import { UpdateMystiflyFlightFareRulesResponseRequestDto } from '../dtos/request/update-mystifly-flight-fare-rules-response-request.dto';
import { MystiflyFlightFareRulesResponse } from '../mystifly-flight-fare-rules-response.entity';

@Injectable()
export class MystiflyFlightFareRulesResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateMystiflyFlightFareRulesResponseRequestDto,
        MystiflyFlightFareRulesResponse,
        forMember(
          (destination) => destination.baggageInfos,
          mapFrom((source) => source.BaggageInfos),
        ),
        forMember(
          (destination) => destination.conversationId,
          mapFrom((source) => source.ConversationId),
        ),
        forMember(
          (destination) => destination.errors,
          mapFrom((source) => source.Errors),
        ),
        forMember(
          (destination) => destination.fareRules,
          mapFrom((source) => source.FareRules),
        ),
        forMember(
          (destination) => destination.traceId,
          mapFrom((source) => source.TraceId),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
      );

      createMap(
        mapper,
        UpdateMystiflyFlightFareRulesResponseRequestDto,
        MystiflyFlightFareRulesResponse,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.baggageInfos,
          mapFrom((source) => source.BaggageInfos),
        ),
        forMember(
          (destination) => destination.conversationId,
          mapFrom((source) => source.ConversationId),
        ),
        forMember(
          (destination) => destination.errors,
          mapFrom((source) => source.Errors),
        ),
        forMember(
          (destination) => destination.fareRules,
          mapFrom((source) => source.FareRules),
        ),
        forMember(
          (destination) => destination.traceId,
          mapFrom((source) => source.TraceId),
        ),
      );
    };
  }
}
