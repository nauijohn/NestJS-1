class PaymentFlightsCheckoutSessionLineItem {
  amount: number;
  currency: string;
  description: string;
  images: string[];
  name: string;
  quantity: number;
}

export class PaymentFlightsCheckoutSessionRequestDto {
  description: string;
  line_items: PaymentFlightsCheckoutSessionLineItem[];
  reference_number?: string;
}
