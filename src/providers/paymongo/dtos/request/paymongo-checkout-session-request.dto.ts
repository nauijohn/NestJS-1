class PaymongoCheckoutSessionAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

class PaymongoCheckoutSessionBilling {
  address: PaymongoCheckoutSessionAddress;
  name: string;
  email: string;
  phone: string;
}

class PaymongoCheckoutSessionLineItem {
  amount: number;
  currency: string;
  description: string;
  images: string[];
  name: string;
  quantity: number;
}

class PaymongoCheckoutSessionAttributes {
  cancel_url: string;
  billing: PaymongoCheckoutSessionBilling;
  description: string;
  line_items: PaymongoCheckoutSessionLineItem[];
  payment_method_types: string[];
  reference_number: string;
  send_email_receipt: boolean;
  show_description: boolean;
  show_line_items: boolean;
  success_url: string;
  statement_descriptor: string;
}

class PaymongoCheckoutSessionData {
  attributes: PaymongoCheckoutSessionAttributes;
}

export class PaymongoCheckoutSessionRequestDto {
  data: PaymongoCheckoutSessionData;
}
