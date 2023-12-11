import { FlightType } from '../../../../bookings/booking-flights/flight-type.enum';

export class CreateTransactionFlightRequestDto {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: string;
  flightType: FlightType;
}
