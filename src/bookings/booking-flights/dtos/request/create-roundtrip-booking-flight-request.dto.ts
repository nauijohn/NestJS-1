import { CreatePassengerDetailRequestDto } from '../../../../flights/passenger-details/dtos/request/create-passenger-detail-request.dto';
import { CreatePaymentFlightRequestDto } from '../../../../payments/payment-flights/dtos/request/create-payment-flight-request.dto';
import { FlightProvider } from '../../flight-provider.enum';
import { FlightType } from '../../flight-type.enum';

export class CreateRoundtripBookingFlightRequestDto {
  flightReference: string;
  customerDetails: {
    name: string;
    email: string;
    mobileNumber: string;
  };
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: string;
  flightType: FlightType;
  provider: FlightProvider;
  providerDetails: {
    departureDetails: any;
    returnDetails: any;
  };
  paymentFlightDetails: CreatePaymentFlightRequestDto;
  transactionId?: string;
  passengerDetails: CreatePassengerDetailRequestDto[];
}
