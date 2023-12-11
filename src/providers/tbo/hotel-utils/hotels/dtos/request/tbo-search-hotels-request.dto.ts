export class TboPaxRooms {
  Adults: number;
  Children: number;
  ChildrenAges: number[];
}

class TboFilters {
  Refundable: boolean;
  NoOfRooms: number;
  MealType: string;
}

export class TboSearchHotelsRequestDto {
  CheckIn: string;
  CheckOut: string;
  HotelCodes: string;
  GuestNationality: string;
  PaxRooms: TboPaxRooms[];
  ResponseTime: number;
  IsDetailedResponse: boolean;
  Filters: TboFilters;
}
