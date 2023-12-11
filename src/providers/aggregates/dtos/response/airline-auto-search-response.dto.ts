export class AirlineDetails {
  _id: string;
  code: string;
  descriptions: string;
}

export class AirlineAutoSearchResponseDto {
  identifier: string;
  tag: AirlineDetails[];
  pagination: number;
  page: number;
  total: number;
}
