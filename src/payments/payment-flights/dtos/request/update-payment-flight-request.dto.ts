import { PaymentStatus } from '../../../../payments/payment-status.enum';

export class UpdatePaymentFlightRequestDto {
  id: number;
  name?: string;
  amount?: number;
  discount?: number;
  status?: PaymentStatus;
}
