import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class TboDayRates {
  @ApiProperty({
    name: 'BasePrice',
    title: 'BasePrice',
    description: 'BasePrice of TBO Search Results',
    type: 'number',
    example: 15313.5922491341,
  })
  BasePrice: number;
}

class TboCancelPolicies {
  @ApiProperty({
    name: 'Index',
    title: 'Index',
    description: 'Index of TBO Search Results',
    type: 'string',
    example: '1',
  })
  Index: string;

  @ApiProperty({
    name: 'FromDate',
    title: 'FromDate',
    description: 'FromDate of TBO Search Results',
    type: 'string',
    example: '28-07-2023 00:00:00',
  })
  FromDate: string;

  @ApiProperty({
    name: 'ChargeType',
    title: 'ChargeType',
    description: 'ChargeType of TBO Search Results',
    type: 'string',
    example: 'Percentage',
  })
  ChargeType: string;

  @ApiProperty({
    name: 'CancellationCharge',
    title: 'CancellationCharge',
    description: 'CancellationCharge of TBO Search Results',
    type: 'number',
    example: 100,
  })
  CancellationCharge: number;
}

export class TboRooms {
  @ApiProperty({
    name: 'Name',
    title: 'Name',
    description: 'Name of TBO Search Results',
    type: Array<string>,
    example: [
      'Standard Room,1 Double Bed,NonSmoking',
      'Standard Room,1 Double Bed,NonSmoking',
    ],
  })
  Name: string[];

  @ApiProperty({
    name: 'BookingCode',
    title: 'BookingCode',
    description: 'BookingCode of TBO Search Results',
    type: 'string',
    example: '1015866!TB!2!TB!79d1094d-76c3-4cd6-b46e-fd0eda5e96f7',
  })
  BookingCode: string;

  @ApiProperty({
    name: 'Inclusion',
    title: 'Inclusion',
    description: 'Inclusion of TBO Search Results',
    type: 'string',
    example: 'Breakfast for 2,Free WiFi',
  })
  Inclusion: string;

  @ApiProperty({
    name: 'DayRates',
    title: 'DayRates',
    description: 'DayRates of TBO Search Results',
    type: [Array<TboDayRates>],
    example: [
      [
        {
          BasePrice: 4160.9752633659,
        },
      ],
      [
        {
          BasePrice: 4160.9752633659,
        },
      ],
    ],
  })
  DayRates: TboDayRates[][];

  @ApiProperty({
    name: 'TotalFare',
    title: 'TotalFare',
    description: 'TotalFare of TBO Search Results',
    type: 'number',
    example: 10928.77,
  })
  TotalFare: number;

  @ApiProperty({
    name: 'TotalTax',
    title: 'TotalTax',
    description: 'TotalTax of TBO Search Results',
    type: 'number',
    example: 1736.84,
  })
  TotalTax: number;

  @ApiProperty({
    name: 'RecommendedSellingRate',
    title: 'RecommendedSellingRate',
    description: 'RecommendedSellingRate of TBO Search Results',
    type: 'string',
    example: '5365.79',
  })
  RecommendedSellingRate: string;

  @ApiProperty({
    name: 'RoomPromotion',
    title: 'RoomPromotion',
    description: 'RoomPromotion of TBO Search Results',
    type: Array<string>,
    example: ['Save20%'],
  })
  RoomPromotion: string[];

  @ApiProperty({
    name: 'CancelPolicies',
    title: 'CancelPolicies',
    description: 'CancelPolicies of TBO Search Results',
    type: [TboCancelPolicies],
  })
  CancelPolicies: TboCancelPolicies[];

  @ApiProperty({
    name: 'MealType',
    title: 'MealType',
    description: 'MealType of TBO Search Results',
    type: 'string',
    example: 'Room_Only',
  })
  MealType: string;

  @ApiProperty({
    name: 'IsRefundable',
    title: 'IsRefundable',
    description: 'IsRefundable of TBO Search Results',
    type: 'boolean',
    example: false,
  })
  IsRefundable: boolean;

  @ApiProperty({
    name: 'WithTransfers',
    title: 'WithTransfers',
    description: 'WithTransfers of TBO Search Results',
    type: 'boolean',
    example: false,
  })
  WithTransfers: boolean;

  @ApiPropertyOptional({
    name: 'Amenities',
    title: 'Amenities',
    description: 'Amenities of TBO Search Results',
    type: Array<string>,
    example: ['Non-Smoking'],
  })
  Amenities?: string[];

  @ApiPropertyOptional({
    name: 'Adults',
    title: 'Adults',
    description: 'Adults of TBO Search Results',
    type: 'number',
    example: 2,
  })
  Adults?: number;

  @ApiPropertyOptional({
    name: 'Children',
    title: 'Children',
    description: 'Children of TBO Search Results',
    type: 'number',
    example: 0,
  })
  Children?: number;
}

export class TboRoomsWithQuantity extends TboRooms {
  quantity: number;
}

export class TboHotelResult {
  @ApiProperty({
    name: 'HotelCode',
    title: 'HotelCode',
    description: 'HotelCode of TBO Search Results',
    type: 'string',
    example: '1015866',
  })
  HotelCode: string;

  @ApiProperty({
    name: 'Currency',
    title: 'Currency',
    description: 'Currency of TBO Search Results',
    type: 'string',
    example: 'PHP',
  })
  Currency: string;

  @ApiProperty({
    name: 'Rooms',
    title: 'Rooms',
    description: 'Rooms of TBO Search Results',
    type: [TboRooms],
  })
  Rooms: TboRooms[];
}

export class TboStatus {
  Code: number;
  Description: string;
}

export class TboSearchHotelsResponseDto {
  Status: TboStatus;
  HotelResult: TboHotelResult[];
}
