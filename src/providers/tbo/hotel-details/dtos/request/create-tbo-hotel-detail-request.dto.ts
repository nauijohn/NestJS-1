import { AutoMap } from '@automapper/classes';

import { TboRooms } from '../../../../../providers/tbo/hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';

export class CreateTboHotelDetailRequestDto {
  @AutoMap()
  HotelCode: string;

  @AutoMap()
  Currency: string;

  @AutoMap(() => [TboRooms])
  Rooms: TboRooms[];

  @AutoMap()
  HotelName: string;

  @AutoMap()
  Description: string;

  @AutoMap(() => Array<string>)
  HotelFacilities: string[];

  @AutoMap(() => Object)
  Attractions: Object;

  @AutoMap(() => Array<string>)
  Images: string[];

  @AutoMap()
  Address: string;

  @AutoMap()
  PinCode: string;

  @AutoMap()
  CityId: string;

  @AutoMap()
  CountryName: string;

  @AutoMap()
  PhoneNumber: string;

  @AutoMap()
  FaxNumber: string;

  @AutoMap()
  Map: string;

  @AutoMap()
  HotelRating: number;

  @AutoMap()
  CityName: string;

  @AutoMap()
  CountryCode: string;

  @AutoMap()
  CheckInTime: string;

  @AutoMap()
  CheckOutTime: string;

  @AutoMap()
  providerReference: string;
}
