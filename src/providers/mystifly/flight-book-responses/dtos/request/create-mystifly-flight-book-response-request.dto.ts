import { BookingFlight } from '../../../../../bookings/booking-flights/booking-flight.entity';

export class CreateMystiflyFlightBookResponseRequestDto {
  ClientUTCOffset: number;
  ConversationId: string;
  Errors: any;
  Status: string;
  TktTimeLimit: string;
  TraceId: string;
  UniqueID: string;
  providerReference: string;
  paymentReferenceNumber: string;
  sequence: number;
  userId: string;
  bookingFlight?: BookingFlight;
  fareSourceCode?: string;
}
