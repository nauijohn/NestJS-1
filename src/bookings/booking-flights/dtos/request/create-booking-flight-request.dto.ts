import { CreatePassengerDetailRequestDto } from '../../../../flights/passenger-details/dtos/request/create-passenger-detail-request.dto';
import { CreatePaymentFlightRequestDto } from '../../../../payments/payment-flights/dtos/request/create-payment-flight-request.dto';
import { FlightProvider } from '../../flight-provider.enum';
import { FlightType } from '../../flight-type.enum';

export class CreateBookingFlightRequestDto {
  customerDetails: {
    name: string;
    email: string;
    mobileNumber: string;
  };
  flightReference: string;
  origin: string;
  destination: string;
  departureDate: Date;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: string;
  provider: FlightProvider;
  providerDetails: any;
  flightType: FlightType;
  paymentFlightDetails: CreatePaymentFlightRequestDto;
  transactionId?: string;
  passengerDetails: CreatePassengerDetailRequestDto[];
}
