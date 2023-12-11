import { FlightProvider } from '../../../../bookings/booking-flights/flight-provider.enum';
import { FlightType } from '../../../../bookings/booking-flights/flight-type.enum';

export class CreatePrebookingFlightRequestDto {
  transactionId: string;
  flightType: FlightType;
  provider: FlightProvider;
  providerDetails: any;
}
