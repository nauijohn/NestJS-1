class TripninjaFlightsSearchDatasourceSegment {
  id: number;
  departure_date: string;
  from_iata: string;
  to_iata: string;
  cabin_class: string;
  from_type: string;
  to_type: string;
}

class TripninjaFlightsSearchDatasourceRequest {
  datasource_request_id: string;
  num_results: number;
  datasource_segments: TripninjaFlightsSearchDatasourceSegment[];
}

export class TripninjaFlightsSearchResponseDto {
  trip_id: string;
  datasource_requests: TripninjaFlightsSearchDatasourceRequest[];
}
