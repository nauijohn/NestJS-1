class TripninjaFlightsGenerateSolutionsLeg {
  departure_time: string;
  departure_timestamp: number;
  arrival_time: string;
  arrival_timestamp: number;
  flight_number: string;
  operating_carrier: string;
  transportation_type: string;
  fare_type: string;
  cabin_class: string;
  segment_leg_position: number;
}

class TripninjaFlightsGenerateSolutionsSegment {
  pricing_solution_id: string;
  is_vi_segment: boolean;
  price: number;
  weight: number;
  segment_position: number;
  segment_source: string;
  legs: TripninjaFlightsGenerateSolutionsLeg[];
}

class Itinerary {
  itinerary_id: string;
  total_price: number;
  weight: number;
  transportation_time: number;
  refundable: unknown;
  is_virtual_interline: boolean;
  structure: string;
  flight_numbers: string[];
  segments: TripninjaFlightsGenerateSolutionsSegment[];
  metadata: unknown[];
}

export class TripninjaFlightsGenerateSolutionsResponseDto {
  trip_id: string;
  itineraries: Itinerary[];
}
