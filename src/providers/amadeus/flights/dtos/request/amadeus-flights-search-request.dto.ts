class AmadeusFlightsDepartureDateTimeRange {
  date: string;
}

class AmadeusFlightsOriginDestinations {
  id: string;
  originLocationCode: string;
  destinationLocationCode: string;
  departureDateTimeRange: AmadeusFlightsDepartureDateTimeRange;
}

class AmadeusFlightsTravelers {
  id: string;
  travelerType: string;
}

export class AmadeusFlightsSearchRequestDto {
  currencyCode: string;
  originDestinations: AmadeusFlightsOriginDestinations[];
  travelers: AmadeusFlightsTravelers[];
  sources: string[];
}
