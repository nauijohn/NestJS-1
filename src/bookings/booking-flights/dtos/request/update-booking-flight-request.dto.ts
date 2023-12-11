export class UpdateBookingFlightRequestDto {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: string;
  fareSourceCode: string;
  conversationId: string;
  isCancellable: boolean;
  transactionId?: string;
}
