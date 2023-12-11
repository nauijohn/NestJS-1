import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateMystiflyFlightBookResponseRequestDto } from '../dtos/request/create-mystifly-flight-book-response-request.dto';
import { UpdateMystiflyFlightBookResponseRequestDto } from '../dtos/request/update-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponse } from '../mystifly-flight-book-response.entity';

@Injectable()
export class MystiflyFlightBookResponsesMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateMystiflyFlightBookResponseRequestDto,
        MystiflyFlightBookResponse,
        forMember(
          (destination) => destination.clientUTCOffset,
          mapFrom((source) => source.ClientUTCOffset),
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
          (destination) => destination.status,
          mapFrom((source) => source.Status),
        ),
        forMember(
          (destination) => destination.tktTimeLimit,
          mapFrom((source) => source.TktTimeLimit),
        ),
        forMember(
          (destination) => destination.traceId,
          mapFrom((source) => source.TraceId),
        ),
        forMember(
          (destination) => destination.uniqueID,
          mapFrom((source) => source.UniqueID),
        ),
        forMember(
          (destination) => destination.paymentReferenceNumber,
          mapFrom((source) => source.paymentReferenceNumber),
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
          (destination) => destination.userId,
          mapFrom((source) => source.userId),
        ),
        forMember(
          (destination) => destination.bookingFlight,
          mapFrom((source) => source.bookingFlight),
        ),
        forMember(
          (destination) => destination.fareSourceCode,
          mapFrom((source) => source.fareSourceCode),
        ),
      );

      createMap(
        mapper,
        UpdateMystiflyFlightBookResponseRequestDto,
        MystiflyFlightBookResponse,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.clientUTCOffset,
          mapFrom((source) => source.ClientUTCOffset),
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
          (destination) => destination.status,
          mapFrom((source) => source.Status),
        ),
        forMember(
          (destination) => destination.tktTimeLimit,
          mapFrom((source) => source.TktTimeLimit),
        ),
        forMember(
          (destination) => destination.traceId,
          mapFrom((source) => source.TraceId),
        ),
        forMember(
          (destination) => destination.uniqueID,
          mapFrom((source) => source.UniqueID),
        ),
        forMember(
          (destination) => destination.paymentReferenceNumber,
          mapFrom((source) => source.paymentReferenceNumber),
        ),
        forMember(
          (destination) => destination.providerReference,
          mapFrom((source) => source.providerReference),
        ),
        forMember(
          (destination) => destination.sequence,
          mapFrom((source) => source.sequence),
        ),
      );
    };
  }
}
