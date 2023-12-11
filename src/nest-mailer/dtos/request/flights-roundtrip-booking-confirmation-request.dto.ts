class FlightsRoundtripBookingConfirmationPassengerDetail {
  name?: string;
  type?: string;
  checkinBaggage?: string;
  cabinBaggage?: string;
}

export class FlightsRoundtripBookingConfirmationDetails {
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
}

export class FlightsRoundtripBookingConfirmationRequestDto {
  to: string;
  subject?: string;
  bookingNumber?: string;
  bookingStatus?: string;
  airlineRef?: string;
  departureDetails?: FlightsRoundtripBookingConfirmationDetails;
  returnDetails?: FlightsRoundtripBookingConfirmationDetails;
  passengerDetails?: FlightsRoundtripBookingConfirmationPassengerDetail[];
  baseFare?: string;
  taxes?: string;
  totalTaxesAndFees?: string;
  grandTotal?: string;
}
