class FlightsOneWayBookingConfirmationPassengerDetail {
  name?: string;
  type?: string;
  checkinBaggage?: string;
  cabinBaggage?: string;
}

export class FlightsOneWayBookingConfirmationRequestDto {
  to: string;
  subject?: string;
  bookingNumber?: string;
  bookingStatus?: string;
  airlineRef?: string;
  fromAndToWithArrow?: string;
  totalFlightDuration?: string;
  origin?: string;
  originAirportAndTerminal?: string;
  departureTime?: string;
  departureDate?: string;
  destination?: string;
  destinationAirportAndTerminal?: string;
  arrivalTime?: string;
  arrivalDate?: string;
  carrier?: string;
  flightNumber?: string;
  cabinClass?: string;
  passengerDetails?: FlightsOneWayBookingConfirmationPassengerDetail[];
  baseFare?: string;
  taxes?: string;
  totalTaxesAndFees?: string;
  grandTotal?: string;
}
