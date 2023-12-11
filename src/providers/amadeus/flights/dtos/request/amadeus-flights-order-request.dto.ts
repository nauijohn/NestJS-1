class AmadeusFlightsOrderStop {
  iataCode: string;
  duration: string;
  arrivalAt: string;
  departureAt: string;
}

class AmadeusFlightsOrderEndPoint {
  iataCode: string;
  terminal: string;
  at: string;
}

class AmadeusFlightsOrderCo2Emission {
  weight: number;
  weightUnit: string;
  cabin: string;
}

class AmadeusFlightsOrderSegment {
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
  co2Emissions: AmadeusFlightsOrderCo2Emission[];
  departure: AmadeusFlightsOrderEndPoint;
  arrival: AmadeusFlightsOrderEndPoint;
  carrierCode: string;
  number: string;
  aircraft: string;
  operating: string;
  duration: string;
  stops: AmadeusFlightsOrderStop[];
}

class AmadeusFlightsOrderItinerary {
  duration: string;
  segments: AmadeusFlightsOrderSegment[];
}

class AmadeusFlightsOrderFlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  disablePricing: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  paymentCardRequired: boolean;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusFlightsOrderItinerary[];
}

export class AmadeusFlightsOrderRequestDto {
  type: string;
  flightOffers: AmadeusFlightsOrderFlightOffer[];
}
