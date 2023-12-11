class AmadeusFlightsSearchResponseMeta {
  count: number;
}

class AmadeusFlightsSearchResponseArrivalOrDeparture {
  iataCode: string;
  terminal?: string;
  at: string;
}

class AmadeusFlightsSearchResponseAircraft {
  code: string;
}

class AmadeusFlightsSearchResponseOperating {
  carrierCode: string;
}

class AmadeusFlightsSearchResponseSegments {
  departure: AmadeusFlightsSearchResponseArrivalOrDeparture;
  arrival: AmadeusFlightsSearchResponseArrivalOrDeparture;
  carrierCode: string;
  number: string;
  aircraft: AmadeusFlightsSearchResponseAircraft;
  operating: AmadeusFlightsSearchResponseOperating;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

class AmadeusFlightsSearchResponseItineraries {
  duration: string;
  segments: AmadeusFlightsSearchResponseSegments[];
}

class AmadeusFlightsSearchResponseFees {
  amount: string;
  type: string;
}

class AmadeusFlightsSearchResponsePrice {
  currency: string;
  total: string;
  base: string;
  fees: AmadeusFlightsSearchResponseFees[];
  grandTotal: string;
}

class AmadeusFlightsSearchResponsePriceOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

class AmadeusFlightsSearchResponseTravelerPricingsPrice {
  currency: string;
  total: string;
  base: string;
}

class AmadeusFlightsSearchResponseIncludedCheckedBags {
  quantity: number;
}

class AmadeusFlightsSearchResponseFareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare: string;
  class: string;
  includedCheckedBags: AmadeusFlightsSearchResponseIncludedCheckedBags;
}

class AmadeusFlightsSearchResponseTravelerPricings {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: AmadeusFlightsSearchResponseTravelerPricingsPrice;
  fareDetailsBySegment: AmadeusFlightsSearchResponseFareDetailsBySegment[];
}

class AmadeusFlightsSearchResponseData {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: string;
  oneWay: string;
  lastTicketingDate: string;
  lastTicketingDateTime: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusFlightsSearchResponseItineraries[];
  price: AmadeusFlightsSearchResponsePrice;
  pricingOptions: AmadeusFlightsSearchResponsePriceOptions;
  validatingAirlineCodes: string[];
  travelerPricings: AmadeusFlightsSearchResponseTravelerPricings[];
}

export class AmadeusFlightsSearchResponseDto {
  meta: AmadeusFlightsSearchResponseMeta;
  data: AmadeusFlightsSearchResponseData[];
}
