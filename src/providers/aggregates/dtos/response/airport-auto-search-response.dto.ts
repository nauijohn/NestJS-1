export class AirportDetails {
  _id: string;
  airportCode: string;
  airportName: string;
  cityCode: string;
  cityName: string;
  countryName: string;
  countryCode: string;
}

export class AirportAutoSearchResponseDto {
  identifier: string;
  tag: AirportDetails[];
  pagination: number;
  page: number;
  total: number;
}
