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
import { CreateTransactionFlightRequestDto } from '../dtos/request/create-transaction-flight-request.dto';
import { UpdateTransactionFlightRequestDto } from '../dtos/request/update-transaction-flight-request.dto';
import { TransactionFlight } from '../transaction-flight.entity';

@Injectable()
export class TransactionFlightsMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateTransactionFlightRequestDto,
        TransactionFlight,
        forMember(
          (destination) => destination.adults,
          mapFrom((source) => source.adults),
        ),
        forMember(
          (destination) => destination.children,
          mapFrom((source) => source.children),
        ),
        forMember(
          (destination) => destination.infants,
          mapFrom((source) => source.infants),
        ),
        forMember(
          (destination) => destination.cabinClass,
          mapFrom((source) => source.cabinClass),
        ),
        forMember(
          (destination) => destination.destination,
          mapFrom((source) => source.destination),
        ),
        forMember(
          (destination) => destination.departureDate,
          mapFrom((source) => source.departureDate),
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
          (destination) => destination.origin,
          mapFrom((source) => source.origin),
        ),
        forMember(
          (destination) => destination.returnDate,
          mapFrom((source) =>
            String(source.returnDate) === 'null' ? null : source.returnDate,
          ),
        ),
      );

      createMap(
        mapper,
        UpdateTransactionFlightRequestDto,
        TransactionFlight,
        forMember(
          (destination) => destination.adults,
          mapFrom((source) => source.adults),
        ),
        forMember(
          (destination) => destination.cabinClass,
          mapFrom((source) => source.cabinClass),
        ),
        forMember(
          (destination) => destination.destination,
          mapFrom((source) => source.destination),
        ),
        forMember(
          (destination) => destination.departureDate,
          mapFrom((source) => source.departureDate),
        ),
        forMember(
          (destination) => destination.flightType,
          mapFrom((source) => source.flightType),
        ),
        forMember(
          (destination) => destination.origin,
          mapFrom((source) => source.origin),
        ),
        forMember(
          (destination) => destination.returnDate,
          mapFrom((source) => source.returnDate),
        ),
        forMember(
          (destination) => destination.returnDate,
          mapFrom((source) => source.returnDate),
        ),
        forMember(
          (destination) => destination.id,
          mapFrom((source) => source.id),
        ),
        forMember(
          (destination) => destination.prebookingFlight,
          mapFrom((source) => source.prebookingFlight),
        ),
        forMember(
          (destination) => destination.paymentFlight,
          mapFrom((source) => source.paymentFlight),
        ),
        forMember(
          (destination) => destination.bookingFlights,
          mapFrom((source) => source.bookingFlights),
        ),
      );
    };
  }
}
