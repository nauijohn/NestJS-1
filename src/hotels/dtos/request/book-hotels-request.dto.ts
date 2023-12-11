export class BookHotelsCustomerName {
  title: string;
  firstName: string;
  lastName: string;
  type: string;
}

export class BookHotelsRequestDto {
  bookingCode: string;
  customerNames: BookHotelsCustomerName[];
  totalFare: number;
  email: string;
  phoneNumber: string;
}
