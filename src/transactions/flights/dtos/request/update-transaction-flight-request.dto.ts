import { BookingFlight } from '../../../../bookings/booking-flights/booking-flight.entity';
import { FlightType } from '../../../../bookings/booking-flights/flight-type.enum';
import { PaymentFlight } from '../../../../payments/payment-flights/payment-flight.entity';
import { PrebookingFlight } from '../../../../prebookings/prebooking-flights/prebooking-flight.entity';

export class UpdateTransactionFlightRequestDto {
  id: number;
  origin?: string;
  destination?: string;
  departureDate?: Date;
  returnDate?: Date;
  adults?: number;
  cabinClass?: string;
  flightType?: FlightType;
  prebookingFlight?: PrebookingFlight;
  paymentFlight?: PaymentFlight;
  bookingFlights?: BookingFlight[];
}
