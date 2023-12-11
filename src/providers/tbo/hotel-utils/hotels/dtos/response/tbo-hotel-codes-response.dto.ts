class TboStatus {
  Code: number;
  Description: string;
}

class TboHotels {
  HotelCode: string;
  HotelName: string;
  HotelRating: string;
  Address: string;
  Attractions: string[];
  CountryName: string;
  CountryCode: string;
  Description: string;
  FaxNumber: string;
  HotelFacilities: string[];
  Map: string;
  PhoneNumber: string;
  PinCode: string;
  HotelWebsiteUrl: string;
  CityName: string;
}

export class TboHotelCodesResponseDto {
  Status: TboStatus;
  Hotels: TboHotels[];
}
