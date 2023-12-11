class TripninjaFlightsSearchSegment {
  id: number;
  from_iata: string;
  from_type: string;
  to_iata: string;
  to_type: string;
  departure_date: string;
  cabin_class: string;
}

export class TripninjaFlightsSearchRequestDto {
  segments: TripninjaFlightsSearchSegment[];
  travellers: string[];
  currency: string;
  country_code: string;
  num_results: number;
  single_pnr: boolean;
  virtual_interlining: boolean;
}
