export class CreatePaymentFlightRequestDto {
  name: string;
  amount: number;
  discount: number;
  referenceNumber: string;
  paymentIntentId: string;
}
