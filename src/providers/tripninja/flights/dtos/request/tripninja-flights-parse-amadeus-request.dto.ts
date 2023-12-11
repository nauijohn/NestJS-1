class TripninjaFlightsParseAmadeusDatasourceSegment {
  id: number;
  departure_date: string;
  from_iata: string;
  to_iata: string;
  cabin_class: string;
  from_type: string;
  to_type: string;
}

class TripninjaFlightsParseAmadeusDatasourceRequest {
  datasource_request_id: string;
  num_results: number;
  datasource_segments: TripninjaFlightsParseAmadeusDatasourceSegment[];
}

export class TripninjaFlightsParseAmadeusRequestDto {
  trip_id: string;
  datasource_requests: TripninjaFlightsParseAmadeusDatasourceRequest[];
  travellers: string[];
}
