import { FlightProvider } from '../../../../bookings/booking-flights/flight-provider.enum';
import { FlightType } from '../../../../bookings/booking-flights/flight-type.enum';

export class UpdatePrebookingFlightResponseDto {
  id: number;
  flightType: FlightType;
  provider: FlightProvider;
}
