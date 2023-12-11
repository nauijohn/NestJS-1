import { ApiProperty } from '@nestjs/swagger';

class MystiflyRevalidationStopQuantityInfo {
  @ApiProperty({
    name: 'ArrivalDateTime',
    title: 'ArrivalDateTime',
    description: 'ArrivalDateTime of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '0001-01-01T00:00:00',
  })
  ArrivalDateTime: string;

  @ApiProperty({
    name: 'DepartureDateTime',
    title: 'DepartureDateTime',
    description: 'DepartureDateTime of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '0001-01-01T00:00:00',
  })
  DepartureDateTime: string;

  @ApiProperty({
    name: 'Duration',
    title: 'Duration',
    description: 'Duration of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 0,
  })
  Duration: number;

  @ApiProperty({
    name: 'LocationCode',
    title: 'LocationCode',
    description: 'LocationCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '',
  })
  LocationCode: string;
}

class MystiflyRevalidationSeatsRemaining {
  @ApiProperty({
    name: 'BelowMinimum',
    title: 'BelowMinimum',
    description: 'BelowMinimum of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: false,
  })
  BelowMinimum: boolean;

  @ApiProperty({
    name: 'Number',
    title: 'Number',
    description: 'Number of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 4,
  })
  Number: number;
}

class MystiflyRevalidationOperatingAirline {
  @ApiProperty({
    name: 'Code',
    title: 'Code',
    description: 'Code of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'CZ',
  })
  Code: string;

  @ApiProperty({
    name: 'Equipment',
    title: 'Equipment',
    description: 'Equipment of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '77W',
  })
  Equipment: string;

  @ApiProperty({
    name: 'FlightNumber',
    title: 'FlightNumber',
    description: 'FlightNumber of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '383',
  })
  FlightNumber: string;
}

class MystiflyRevalidationFlightSegments {
  @ApiProperty({
    name: 'ArrivalAirportLocationCode',
    title: 'ArrivalAirportLocationCode',
    description:
      'ArrivalAirportLocationCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'DXB',
  })
  ArrivalAirportLocationCode: string;

  @ApiProperty({
    name: 'ArrivalDateTime',
    title: 'ArrivalDateTime',
    description: 'ArrivalDateTime of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '2023-10-26T23:05:00',
  })
  ArrivalDateTime: string;

  @ApiProperty({
    name: 'CabinClassCode',
    title: 'CabinClassCode',
    description: 'CabinClassCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'Y',
  })
  CabinClassCode: string;

  @ApiProperty({
    name: 'CabinClassText',
    title: 'CabinClassText',
    description: 'CabinClassText of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'ECONOMY STANDARD',
  })
  CabinClassText: string;

  @ApiProperty({
    name: 'CabinClassType',
    title: 'CabinClassType',
    description: 'CabinClassType of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'Economy',
  })
  CabinClassType: string;

  @ApiProperty({
    name: 'DepartureAirportLocationCode',
    title: 'DepartureAirportLocationCode',
    description:
      'DepartureAirportLocationCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'MNL',
  })
  DepartureAirportLocationCode: string;

  @ApiProperty({
    name: 'DepartureDateTime',
    title: 'DepartureDateTime',
    description: 'DepartureDateTime of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '2023-10-26T11:55:00',
  })
  DepartureDateTime: string;

  @ApiProperty({
    name: 'Eticket',
    title: 'Eticket',
    description: 'Eticket of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: true,
  })
  Eticket: boolean;

  @ApiProperty({
    name: 'FlightNumber',
    title: 'FlightNumber',
    description: 'FlightNumber of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '3092',
  })
  FlightNumber: string;

  @ApiProperty({
    name: 'JourneyDuration',
    title: 'JourneyDuration',
    description: 'JourneyDuration of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 155,
  })
  JourneyDuration: number;

  @ApiProperty({
    name: 'MarketingAirlineCode',
    title: 'MarketingAirlineCode',
    description: 'MarketingAirlineCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'CZ',
  })
  MarketingAirlineCode: string;

  @ApiProperty({
    name: 'MarriageGroup',
    title: 'MarriageGroup',
    description: 'MarriageGroup of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '',
  })
  MarriageGroup: string;

  @ApiProperty({
    name: 'MealCode',
    title: 'MealCode',
    description: 'MealCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '',
  })
  MealCode: string;

  @ApiProperty({
    name: 'OperatingAirline',
    title: 'OperatingAirline',
    description: 'OperatingAirline of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationOperatingAirline,
  })
  OperatingAirline: MystiflyRevalidationOperatingAirline;

  @ApiProperty({
    name: 'ResBookDesigCode',
    title: 'ResBookDesigCode',
    description: 'ResBookDesigCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'N',
  })
  ResBookDesigCode: string;

  @ApiProperty({
    name: 'ResBookDesigText',
    title: 'ResBookDesigText',
    description: 'ResBookDesigText of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'ECONOMY STANDARD',
  })
  ResBookDesigText: string;

  @ApiProperty({
    name: 'SeatsRemaining',
    title: 'SeatsRemaining',
    description: 'SeatsRemaining of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationSeatsRemaining,
  })
  SeatsRemaining: MystiflyRevalidationSeatsRemaining;

  @ApiProperty({
    name: 'StopQuantity',
    title: 'StopQuantity',
    description: 'StopQuantity of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 0,
  })
  StopQuantity: number;

  @ApiProperty({
    name: 'StopQuantityInfo',
    title: 'StopQuantityInfo',
    description: 'StopQuantityInfo of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationStopQuantityInfo,
  })
  StopQuantityInfo: MystiflyRevalidationStopQuantityInfo;
}

class MystiflyRevalidationOriginDestinationOptions {
  @ApiProperty({
    name: 'FlightSegments',
    title: 'FlightSegments',
    description: 'FlightSegments of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationFlightSegments],
  })
  FlightSegments: MystiflyRevalidationFlightSegments[];
}

class MystiflyRevalidationPenaltiesInfo {
  @ApiProperty({
    name: 'Allowed',
    title: 'Allowed',
    description: 'Allowed of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: true,
  })
  Allowed: boolean;

  @ApiProperty({
    name: 'Amount',
    title: 'Amount',
    description: 'Amount of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '16650.0',
  })
  Amount: string;

  @ApiProperty({
    name: 'CurrencyCode',
    title: 'CurrencyCode',
    description: 'CurrencyCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'INR',
  })
  CurrencyCode: string;

  @ApiProperty({
    name: 'PenaltyType',
    title: 'PenaltyType',
    description: 'PenaltyType of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'Cancel',
  })
  PenaltyType: string;
}

class MystiflyRevalidationPassengerTypeQuantity {
  @ApiProperty({
    name: 'Code',
    title: 'Code',
    description: 'Code of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'ADT',
  })
  Code: string;

  @ApiProperty({
    name: 'Quantity',
    title: 'Quantity',
    description: 'Quantity of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 1,
  })
  Quantity: number;
}

class MystiflyRevalidationTaxes {
  @ApiProperty({
    name: 'Amount',
    title: 'Amount',
    description: 'Amount of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '4.00',
  })
  Amount: string;

  @ApiProperty({
    name: 'CurrencyCode',
    title: 'CurrencyCode',
    description: 'CurrencyCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'USD',
  })
  CurrencyCode: string;

  @ApiProperty({
    name: 'DecimalPlaces',
    title: 'DecimalPlaces',
    description: 'DecimalPlaces of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 2,
  })
  DecimalPlaces: number;

  @ApiProperty({
    name: 'TaxCode',
    title: 'TaxCode',
    description: 'TaxCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'YQI',
  })
  TaxCode: string;
}

class MystiflyRevalidationFare {
  @ApiProperty({
    name: 'Amount',
    title: 'Amount',
    description: 'Amount of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '168.61',
  })
  Amount: string;

  @ApiProperty({
    name: 'CurrencyCode',
    title: 'CurrencyCode',
    description: 'CurrencyCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'USD',
  })
  CurrencyCode: string;

  @ApiProperty({
    name: 'DecimalPlaces',
    title: 'DecimalPlaces',
    description: 'DecimalPlaces of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 2,
  })
  DecimalPlaces: number;
}

class MystiflyRevalidationPassengerFare {
  @ApiProperty({
    name: 'BaseFare',
    title: 'BaseFare',
    description: 'BaseFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  BaseFare: MystiflyRevalidationFare;

  @ApiProperty({
    name: 'EquivFare',
    title: 'EquivFare',
    description: 'EquivFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  EquivFare: MystiflyRevalidationFare;

  @ApiProperty({
    name: 'Surcharges',
    title: 'Surcharges',
    description: 'Surcharges of Mystifly Revalidation Response Dto',
    type: Array<unknown>,
    example: [],
  })
  Surcharges: Array<unknown>;

  @ApiProperty({
    name: 'Taxes',
    title: 'Taxes',
    description: 'Taxes of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationTaxes],
  })
  Taxes: MystiflyRevalidationTaxes[];

  @ApiProperty({
    name: 'TotalFare',
    title: 'TotalFare',
    description: 'TotalFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  TotalFare: MystiflyRevalidationFare;
}

class MystiflyRevalidationPTC_FareBreakdowns {
  @ApiProperty({
    name: 'BaggageInfo',
    title: 'BaggageInfo',
    description: 'BaggageInfo of Mystifly Revalidation Response Dto',
    type: Array<string>,
    example: ['2PC'],
  })
  BaggageInfo: string[];

  @ApiProperty({
    name: 'CabinBaggageInfo',
    title: 'CabinBaggageInfo',
    description: 'CabinBaggageInfo of Mystifly Revalidation Response Dto',
    type: Array<string>,
    example: ['SB'],
  })
  CabinBaggageInfo: string[];

  @ApiProperty({
    name: 'FareBasisCodes',
    title: 'FareBasisCodes',
    description: 'FareBasisCodes of Mystifly Revalidation Response Dto',
    type: Array<string>,
    example: ['ACZ3092N'],
  })
  FareBasisCodes: string[];

  @ApiProperty({
    name: 'PassengerFare',
    title: 'PassengerFare',
    description: 'PassengerFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationPassengerFare,
  })
  PassengerFare: MystiflyRevalidationPassengerFare;

  @ApiProperty({
    name: 'PassengerTypeQuantity',
    title: 'PassengerTypeQuantity',
    description: 'PassengerTypeQuantity of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationPassengerTypeQuantity,
  })
  PassengerTypeQuantity: MystiflyRevalidationPassengerTypeQuantity;

  @ApiProperty({
    name: 'PenaltiesInfo',
    title: 'PenaltiesInfo',
    description: 'PenaltiesInfo of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationPenaltiesInfo],
  })
  PenaltiesInfo: MystiflyRevalidationPenaltiesInfo[];
}

class MystiflyRevalidationItinTotalFare {
  @ApiProperty({
    name: 'BaseFare',
    title: 'BaseFare',
    description: 'BaseFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  BaseFare: MystiflyRevalidationFare;

  @ApiProperty({
    name: 'EquivFare',
    title: 'EquivFare',
    description: 'EquivFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  EquivFare: MystiflyRevalidationFare;

  @ApiProperty({
    name: 'TotalFare',
    title: 'TotalFare',
    description: 'TotalFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  TotalFare: MystiflyRevalidationFare;

  @ApiProperty({
    name: 'TotalTax',
    title: 'TotalTax',
    description: 'TotalTax of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationFare,
  })
  TotalTax: MystiflyRevalidationFare;

  @ApiProperty({
    name: 'TotalFareWithMarkUp',
    title: 'TotalFareWithMarkUp',
    description: 'TotalFareWithMarkUp of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '2133.23',
  })
  TotalFareWithMarkUp?: string;
}

class MystiflyRevalidationFareInfos {
  @ApiProperty({
    name: 'FareReference',
    title: 'FareReference',
    description: 'FareReference of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'N',
  })
  FareReference: string;
}

class MystiflyRevalidationAirItineraryPricingInfo {
  @ApiProperty({
    name: 'DivideInPartyIndicator',
    title: 'DivideInPartyIndicator',
    description: 'DivideInPartyIndicator of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: false,
  })
  DivideInPartyIndicator: boolean;

  @ApiProperty({
    name: 'FareInfos',
    title: 'FareInfos',
    description: 'FareInfos of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationFareInfos],
  })
  FareInfos: MystiflyRevalidationFareInfos[];

  @ApiProperty({
    name: 'FareSourceCode',
    title: 'FareSourceCode',
    description: 'FareSourceCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example:
      'MzQwOWcwY0JPSFpvdTBmSWpCME5tT2lkYzc0aVJHbkhFaHoyUjZiNU9JNEdLdmswRStqQ2dnVkE4RTFFK1NqUTJxRWQzY2hDWVE0cHdOYkt1dVFycEl3TkgzbGdvbDllV3RyckRlalo1UWpmcGM1eVVLazE0ODRDZ2FoOHdBUk5sbHZrQ0JLSFRwNUlFZ0ZPYlE4Vy9JVlFhY3dXdHpKUTRzVUFLeEFIZ1BVPQ==',
  })
  FareSourceCode: string;

  @ApiProperty({
    name: 'FareType',
    title: 'FareType',
    description: 'FareType of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'Public',
  })
  FareType: string;

  @ApiProperty({
    name: 'IsRefundable',
    title: 'IsRefundable',
    description: 'IsRefundable of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'Yes',
  })
  IsRefundable: string;

  @ApiProperty({
    name: 'ItinTotalFare',
    title: 'ItinTotalFare',
    description: 'ItinTotalFare of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationItinTotalFare,
  })
  ItinTotalFare: MystiflyRevalidationItinTotalFare;

  @ApiProperty({
    name: 'PTC_FareBreakdowns',
    title: 'PTC_FareBreakdowns',
    description: 'PTC_FareBreakdowns of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationPTC_FareBreakdowns],
  })
  PTC_FareBreakdowns: MystiflyRevalidationPTC_FareBreakdowns[];
}

export class MystiflyRevalidationExtraServices {
  @ApiProperty({
    name: 'NameNumbers',
    title: 'NameNumbers',
    description: 'NameNumbers of Mystifly Revalidation Response Dto',
    type: Array<unknown>,
    example: [],
  })
  NameNumbers: Array<unknown>;

  @ApiProperty({
    name: 'Services',
    title: 'Services',
    description: 'Services of Mystifly Revalidation Response Dto',
    type: Array<unknown>,
    example: [],
  })
  Services: Array<unknown>;
}

export class MystiflyRevalidationPricedItineraries {
  @ApiProperty({
    name: 'AirItineraryPricingInfo',
    title: 'AirItineraryPricingInfo',
    description:
      'AirItineraryPricingInfo of Mystifly Revalidation Response Dto',
    type: MystiflyRevalidationAirItineraryPricingInfo,
  })
  AirItineraryPricingInfo: MystiflyRevalidationAirItineraryPricingInfo;

  @ApiProperty({
    name: 'DirectionInd',
    title: 'DirectionInd',
    description: 'DirectionInd of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'OneWay',
  })
  DirectionInd: string;

  @ApiProperty({
    name: 'HoldAllowed',
    title: 'HoldAllowed',
    description: 'HoldAllowed of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'True',
  })
  HoldAllowed: string;

  @ApiProperty({
    name: 'IsPassportMandatory',
    title: 'IsPassportMandatory',
    description: 'IsPassportMandatory of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: false,
  })
  IsPassportMandatory: boolean;

  @ApiProperty({
    name: 'OriginDestinationOptions',
    title: 'OriginDestinationOptions',
    description:
      'OriginDestinationOptions of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationOriginDestinationOptions],
  })
  OriginDestinationOptions: MystiflyRevalidationOriginDestinationOptions[];

  @ApiProperty({
    name: 'PaxNameCharacterLimit',
    title: 'PaxNameCharacterLimit',
    description: 'PaxNameCharacterLimit of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 60,
  })
  PaxNameCharacterLimit: number;

  @ApiProperty({
    name: 'Provider',
    title: 'Provider',
    description: 'Provider of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'MYSTIFLY',
  })
  Provider: string;

  @ApiProperty({
    name: 'SequenceNumber',
    title: 'SequenceNumber',
    description: 'SequenceNumber of Mystifly Revalidation Response Dto',
    type: 'number',
    example: 1,
  })
  SequenceNumber: number;

  @ApiProperty({
    name: 'TicketType',
    title: 'TicketType',
    description: 'TicketType of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'eTicket',
  })
  TicketType: string;

  @ApiProperty({
    name: 'ValidatingAirlineCode',
    title: 'ValidatingAirlineCode',
    description: 'ValidatingAirlineCode of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'CZ',
  })
  ValidatingAirlineCode: string;

  @ApiProperty({
    name: 'VoidWindowTLinMins',
    title: 'VoidWindowTLinMins',
    description: 'VoidWindowTLinMins of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '803',
  })
  VoidWindowTLinMins: string;
}

export class MystiflyRevalidationData {
  @ApiProperty({
    name: 'ConversationId',
    title: 'ConversationId',
    description: 'ConversationId of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'ef246e00-593a-45e8-80da-a12c766c7622',
  })
  ConversationId: string;

  @ApiProperty({
    name: 'Errors',
    title: 'Errors',
    description: 'Errors of Mystifly Revalidation Response Dto',
    type: Array<unknown>,
    example: [],
  })
  Errors: Array<unknown>;

  @ApiProperty({
    name: 'IsValid',
    title: 'IsValid',
    description: 'IsValid of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: true,
  })
  IsValid: boolean;

  @ApiProperty({
    name: 'IsValidReason',
    title: 'IsValidReason',
    description: 'IsValidReason of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'NoChanges',
  })
  IsValidReason: string;

  @ApiProperty({
    name: 'PricedItineraries',
    title: 'PricedItineraries',
    description: 'PricedItineraries of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationPricedItineraries],
  })
  PricedItineraries: MystiflyRevalidationPricedItineraries[];

  @ApiProperty({
    name: 'Success',
    title: 'Success',
    description: 'Success of Mystifly Revalidation Response Dto',
    type: 'boolean',
    example: true,
  })
  Success: boolean;

  @ApiProperty({
    name: 'Target',
    title: 'Target',
    description: 'Target of Mystifly Revalidation Response Dto',
    type: 'string',
    example: 'Test',
  })
  Target: string;

  @ApiProperty({
    name: 'TraceId',
    title: 'TraceId',
    description: 'TraceId of Mystifly Revalidation Response Dto',
    type: 'string',
    example: '23101808-d3e48cff-6956-47be-a0ec-ce7429d1e5b2',
  })
  TraceId: string;

  @ApiProperty({
    name: 'ExtraServices',
    title: 'ExtraServices',
    description: 'ExtraServices of Mystifly Revalidation Response Dto',
    type: [MystiflyRevalidationExtraServices],
  })
  ExtraServices: MystiflyRevalidationExtraServices[];
}

export class MystiflyRevalidationResponseDto {
  Data: MystiflyRevalidationData;
  Success: boolean;
}
