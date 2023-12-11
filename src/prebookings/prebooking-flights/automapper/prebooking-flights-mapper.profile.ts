import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { FlightType } from '../../../bookings/booking-flights/flight-type.enum';
import { CreateOneWayPrebookingFlightRequestDto } from '../dtos/request/create-one-way-prebooking-flight-request.dto';
import { CreatePrebookingFlightRequestDto } from '../dtos/request/create-prebooking-flight-request.dto';
import { CreateRoundtripPrebookingFlightRequestDto } from '../dtos/request/create-roundtrip-prebooking-flight-request.dto';
import { UpdatePrebookingFlightResponseDto } from '../dtos/request/update-prebooking-flight-request.dto';
import { PrebookingFlight } from '../prebooking-flight.entity';

@Injectable()
export class PrebookingFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreatePrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => {
            if (`${source.flightType}` === 'one-way') return FlightType.OneWay;
            if (`${source.flightType}` === 'round-trip')
              return FlightType.Roundtrip;
            return source.flightType;
          }),
        ),
        forMember(
          (destination) => destination.provider,
          mapFrom((source) => source.provider.toLowerCase()),
        ),
      );

      createMap(
        mapper,
        CreateOneWayPrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => {
            if (`${source.flightType}` === 'one-way') return FlightType.OneWay;
            if (`${source.flightType}` === 'round-trip')
              return FlightType.Roundtrip;
            return source.flightType;
          }),
        ),
        forMember(
          (destination) => destination.provider,
          mapFrom((source) => source.provider.toLowerCase()),
        ),
      );

      createMap(
        mapper,
        CreateRoundtripPrebookingFlightRequestDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => {
            if (`${source.flightType}` === 'one-way') return FlightType.OneWay;
            if (`${source.flightType}` === 'round-trip')
              return FlightType.Roundtrip;
            return source.flightType;
          }),
        ),
        forMember(
          (destination) => destination.provider,
          mapFrom((source) => source.provider.toLowerCase()),
        ),
      );

      createMap(
        mapper,
        UpdatePrebookingFlightResponseDto,
        PrebookingFlight,
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => {
            if (`${source.flightType}` === 'one-way') return FlightType.OneWay;
            if (`${source.flightType}` === 'round-trip')
              return FlightType.Roundtrip;
            return source.flightType;
          }),
        ),
        forMember(
          (destination) => destination.provider,
          mapFrom((source) => source.provider.toLowerCase()),
        ),
      );
    };
  }
}
