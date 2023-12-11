class TboStatus {
  Code: number;
  Description: string;
}

export class TboHotelDetails {
  HotelCode: string;
  HotelName: string;
  Description: string;
  HotelFacilities: string[];
  Attractions: object;
  Images: string[];
  Address: string;
  PinCode: string;
  CityId: string;
  CountryName: string;
  PhoneNumber: string;
  FaxNumber: string;
  Map: string;
  HotelRating: number;
  CityName: string;
  CountryCode: string;
  CheckInTime: string;
  CheckOutTime: string;
}

export class TboHotelDetailsResponseDto {
  Status: TboStatus;
  HotelDetails: TboHotelDetails[];
}
