import { FlightProvider } from '../../../../bookings/booking-flights/flight-provider.enum';
import { FlightType } from '../../../../bookings/booking-flights/flight-type.enum';

export class CreateRoundtripPrebookingFlightRequestDto {
  transactionId: string;
  flightType: FlightType;
  provider: FlightProvider;
  providerDetails: {
    departureDetails: any;
    returnDetails: any;
  };
}
