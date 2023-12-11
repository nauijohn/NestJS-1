import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateMystiflyFlightRevalidationResponseRequestDto } from '../dtos/request/create-mystifly-flight-revalidation-response-request.dto';
import { UpdateMystiflyFlightRevalidationResponseRequestDto } from '../dtos/request/update-mystifly-flight-revalidation-response-request.dto';
import { MystiflyFlightRevalidationResponse } from '../mystifly-flight-revalidation-response.entity';

@Injectable()
export class MystiflyFlightRevalidationResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateMystiflyFlightRevalidationResponseRequestDto,
        MystiflyFlightRevalidationResponse,
        forMember(
          (destination) => destination.conversationId,
          mapFrom((source) => source.ConversationId),
        ),
        forMember(
          (destination) => destination.errors,
          mapFrom((source) => source.Errors),
        ),
        forMember(
          (destination) => destination.extraServices,
          mapFrom((source) => source.ExtraServices),
        ),
        forMember(
          (destination) => destination.isValidReason,
          mapFrom((source) => source.IsValidReason),
        ),
        forMember(
          (destination) => destination.pricedItineraries,
          mapFrom((source) => source.PricedItineraries),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
        forMember(
          (destination) => destination.traceId,
          mapFrom((source) => source.TraceId),
        ),
      );

      createMap(
        mapper,
        UpdateMystiflyFlightRevalidationResponseRequestDto,
        MystiflyFlightRevalidationResponse,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
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
          (destination) => destination.extraServices,
          mapFrom((source) => source.ExtraServices),
        ),
        forMember(
          (destination) => destination.isValidReason,
          mapFrom((source) => source.IsValidReason),
        ),
        forMember(
          (destination) => destination.pricedItineraries,
          mapFrom((source) => source.PricedItineraries),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
        forMember(
          (destination) => destination.traceId,
          mapFrom((source) => source.TraceId),
        ),
      );
    };
  }
}
