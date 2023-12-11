import { PaymentStatus } from '../../../../payments/payment-status.enum';

export class UpdatePaymentHotelsRequestDto {
  id: number;
  name?: string;
  amount?: number;
  discount?: number;
  status?: PaymentStatus;
}
