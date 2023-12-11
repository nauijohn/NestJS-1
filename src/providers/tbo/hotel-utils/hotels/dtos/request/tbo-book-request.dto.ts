export class TboCustomerName {
  Title: string;
  FirstName: string;
  LastName: string;
  Type: string;
}

export class TboCustomerDetail {
  CustomerNames: TboCustomerName[];
}

class TboCardHolderAddress {
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  PostalCode: string;
  CountryCode: string;
}

class TboPaymentInfo {
  CvvNumber: string;
  CardNumber: string;
  CardExpirationMonth: string;
  CardExpirationYear: string;
  CardHolderFirstName: string;
  CardHolderlastName: string;
  BillingAmount: number;
  BillingCurrency: string;
  CardHolderAddress: TboCardHolderAddress;
}

export class TboBookRequestDto {
  BookingCode: string;
  CustomerDetails: TboCustomerDetail[];
  ClientReferenceId: string;
  BookingReferenceId: string;
  TotalFare: number;
  EmailId: string;
  PhoneNumber: string;
  BookingType: string;
  PaymentMode: string;
  PaymentInfo?: TboPaymentInfo;
}
