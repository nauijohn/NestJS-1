import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class LocationDetails {
  @ApiProperty({
    name: 'airportCode',
    title: 'airportCode',
    description: 'airportCode of Mystifly Search Results',
    type: 'string',
    example: 'MNL',
  })
  airportCode: string;

  @ApiProperty({
    name: 'airportName',
    title: 'airportName',
    description: 'airportName of Mystifly Search Results',
    type: 'string',
    example: 'Ninoy Aquino Intl',
  })
  airportName: string;

  @ApiProperty({
    name: 'cityCode',
    title: 'cityCode',
    description: 'cityCode of Mystifly Search Results',
    type: 'string',
    example: 'MNL',
  })
  cityCode: string;

  @ApiProperty({
    name: 'cityName',
    title: 'cityName',
    description: 'cityName of Mystifly Search Results',
    type: 'string',
    example: 'Manila',
  })
  cityName: string;

  @ApiProperty({
    name: 'countryName',
    title: 'countryName',
    description: 'countryName of Mystifly Search Results',
    type: 'string',
    example: 'Philippines',
  })
  countryName: string;

  @ApiProperty({
    name: 'countryCode',
    title: 'countryCode',
    description: 'countryCode of Mystifly Search Results',
    type: 'string',
    example: 'PH',
  })
  countryCode: string;
}

class OperatingCarrierDetails {
  @ApiProperty({
    name: 'code',
    title: 'code',
    description: 'code of Mystifly Search Results',
    type: 'string',
    example: '5J',
  })
  code: string;

  @ApiProperty({
    name: 'descriptions',
    title: 'descriptions',
    description: 'descriptions of Mystifly Search Results',
    type: 'string',
    example: 'Cebu Pacific',
  })
  descriptions: string;
}

class FlightSegment {
  @ApiProperty({
    name: 'DepartureAirportLocationCode',
    title: 'DepartureAirportLocationCode',
    description: 'DepartureAirportLocationCode of Mystifly Search Results',
    type: 'string',
    example: 'ICN',
  })
  DepartureAirportLocationCode: string;

  @ApiProperty({
    name: 'ArrivalAirportLocationCode',
    title: 'ArrivalAirportLocationCode',
    description: 'ArrivalAirportLocationCode of Mystifly Search Results',
    type: 'string',
    example: 'JFK',
  })
  ArrivalAirportLocationCode: string;

  @ApiProperty({
    name: 'DepartureDateTime',
    title: 'DepartureDateTime',
    description: 'DepartureDateTime of Mystifly Search Results',
    type: 'string',
    example: '2023-07-30T10:00:00',
  })
  DepartureDateTime: string;

  @ApiProperty({
    name: 'ArrivalDateTime',
    title: 'ArrivalDateTime',
    description: 'ArrivalDateTime of Mystifly Search Results',
    type: 'string',
    example: '2023-07-30T11:20:00',
  })
  ArrivalDateTime: string;

  @ApiProperty({
    name: 'stops',
    title: 'stops',
    description: 'stops of Mystifly Search Results',
    type: 'number',
    example: 0,
  })
  stops: number;

  @ApiProperty({
    name: 'JourneyDuration',
    title: 'JourneyDuration',
    description: 'JourneyDuration of Mystifly Search Results',
    type: 'number',
    example: 255,
  })
  JourneyDuration: number;

  @ApiProperty({
    name: 'Equipment',
    title: 'Equipment',
    description: 'Equipment of Mystifly Search Results',
    type: 'string',
    example: '773',
  })
  Equipment: string;

  @ApiProperty({
    name: 'OperatingCarrierCode',
    title: 'OperatingCarrierCode',
    description: 'OperatingCarrierCode of Mystifly Search Results',
    type: 'string',
    example: 'SQ',
  })
  OperatingCarrierCode: string;

  @ApiProperty({
    name: 'OperatingFlightNumber',
    title: 'OperatingFlightNumber',
    description: 'OperatingFlightNumber of Mystifly Search Results',
    type: 'string',
    example: '917',
  })
  OperatingFlightNumber: string;

  @ApiProperty({
    name: 'MarketingCarriercode',
    title: 'MarketingCarriercode',
    description: 'MarketingCarriercode of Mystifly Search Results',
    type: 'string',
    example: 'SQ',
  })
  MarketingCarriercode: string;

  @ApiProperty({
    name: 'MarketingFlightNumber',
    title: 'MarketingFlightNumber',
    description: 'MarketingFlightNumber of Mystifly Search Results',
    type: 'string',
    example: '26',
  })
  MarketingFlightNumber: string;

  @ApiProperty({
    name: 'StopQuantityInfos',
    title: 'StopQuantityInfos',
    description: 'StopQuantityInfos of Mystifly Search Results',
    type: [],
    example: [],
  })
  StopQuantityInfos: unknown[];

  @ApiProperty({
    name: 'SegmentRef',
    title: 'SegmentRef',
    description: 'SegmentRef of Mystifly Search Results',
    type: 'number',
    example: 21,
  })
  SegmentRef: number;

  @ApiProperty({
    name: 'DepartureLocationDetails',
    title: 'DepartureLocationDetails',
    description: 'DepartureLocationDetails of Mystifly Search Results',
    type: LocationDetails,
  })
  DepartureLocationDetails: LocationDetails;

  @ApiProperty({
    name: 'ArrivalLocationDetails',
    title: 'ArrivalLocationDetails',
    description: 'ArrivalLocationDetails of Mystifly Search Results',
    type: LocationDetails,
  })
  ArrivalLocationDetails: LocationDetails;

  @ApiProperty({
    name: 'OperatingCarrierDetails',
    title: 'OperatingCarrierDetails',
    description: 'OperatingCarrierDetails of Mystifly Search Results',
    type: OperatingCarrierDetails,
  })
  OperatingCarrierDetails: OperatingCarrierDetails;
}

class CheckinBaggage {
  @ApiProperty({
    name: 'Type',
    title: 'Type',
    description: 'Type of Mystifly Search Results',
    type: 'string',
    example: 'ADT',
  })
  Type: string;

  @ApiProperty({
    name: 'Value',
    title: 'Value',
    description: 'Value of Mystifly Search Results',
    type: 'string',
    example: '2PC',
  })
  Value: string;
}

class CabinBaggage {
  @ApiProperty({
    name: 'Type',
    title: 'Type',
    description: 'Type of Mystifly Search Results',
    type: 'string',
    example: 'ADT',
  })
  Type: string;

  @ApiProperty({
    name: 'Value',
    title: 'Value',
    description: 'Value of Mystifly Search Results',
    type: 'string',
    example: '7KG',
  })
  Value: string;
}

class ItineraryReference {
  @ApiProperty({
    name: 'CabinClassCode',
    title: 'CabinClassCode',
    description: 'CabinClassCode of Mystifly Search Results',
    type: 'string',
    example: 'Y',
  })
  CabinClassCode: string;

  @ApiProperty({
    name: 'CabinClassType',
    title: 'CabinClassType',
    description: 'CabinClassType of Mystifly Search Results',
    type: 'string',
    example: 'Economy',
  })
  CabinClassType: string;

  @ApiProperty({
    name: 'RBD',
    title: 'RBD',
    description: 'RBD of Mystifly Search Results',
    type: 'string',
    example: 'V',
  })
  RBD: string;

  @ApiProperty({
    name: 'FareFamily',
    title: 'FareFamily',
    description: 'FareFamily of Mystifly Search Results',
    type: 'string',
    example: 'ECONOMY ESSENTIAL',
  })
  FareFamily: string;

  @ApiProperty({
    name: 'SeatsRemaining',
    title: 'SeatsRemaining',
    description: 'SeatsRemaining of Mystifly Search Results',
    type: 'number',
    example: 9,
  })
  SeatsRemaining: number;

  @ApiProperty({
    name: 'CheckinBaggage',
    title: 'CheckinBaggage',
    description: 'CheckinBaggage of Mystifly Search Results',
    type: [CheckinBaggage],
  })
  CheckinBaggage: CheckinBaggage[];

  @ApiProperty({
    name: 'CabinBaggage',
    title: 'CabinBaggage',
    description: 'CabinBaggage of Mystifly Search Results',
    type: [CabinBaggage],
  })
  CabinBaggage: CabinBaggage[];

  @ApiProperty({
    name: 'FareBasisCodes',
    title: 'FareBasisCodes',
    description: 'FareBasisCodes of Mystifly Search Results',
    type: 'string',
    example: 'SR31PHAO',
  })
  FareBasisCodes: string;

  @ApiProperty({
    name: 'ItineraryRef',
    title: 'ItineraryRef',
    description: 'ItineraryRef of Mystifly Search Results',
    type: 'number',
    example: 10,
  })
  ItineraryRef: number;
}

class OriginDestinations {
  @ApiProperty({
    name: 'FlightSegment',
    title: 'FlightSegment',
    description: 'FlightSegment of Mystifly Search Results',
    type: FlightSegment,
  })
  FlightSegment: FlightSegment;

  @ApiProperty({
    name: 'ItineraryReference',
    title: 'ItineraryReference',
    description: 'ItineraryReference of Mystifly Search Results',
    type: ItineraryReference,
  })
  ItineraryReference: ItineraryReference;

  @ApiProperty({
    name: 'LegIndicator',
    title: 'LegIndicator',
    description: 'LegIndicator of Mystifly Search Results',
    type: 'string',
    example: '0',
  })
  LegIndicator: string;
}

class TaxBreakUp {
  @ApiProperty({
    name: 'Amount',
    title: 'Amount',
    description: 'Amount of Mystifly Search Results',
    type: 'string',
    example: '10.09',
  })
  Amount: string;

  @ApiProperty({
    name: 'TaxCode',
    title: 'TaxCode',
    description: 'TaxCode of Mystifly Search Results',
    type: 'string',
    example: 'LI',
  })
  TaxCode: string;
}

class PassengerFare {
  @ApiProperty({
    name: 'PaxType',
    title: 'PaxType',
    description: 'PaxType of Mystifly Search Results',
    type: 'string',
    example: 'ADT',
  })
  PaxType: string;

  @ApiProperty({
    name: 'Quantity',
    title: 'Quantity',
    description: 'Quantity of Mystifly Search Results',
    type: 'number',
    example: 1,
  })
  Quantity: number;

  @ApiProperty({
    name: 'BaseFare',
    title: 'BaseFare',
    description: 'BaseFare of Mystifly Search Results',
    type: 'string',
    example: '878.94',
  })
  BaseFare: string;

  @ApiProperty({
    name: 'TaxBreakUp',
    title: 'TaxBreakUp',
    description: 'TaxBreakUp of Mystifly Search Results',
    type: [TaxBreakUp],
  })
  TaxBreakUp: TaxBreakUp[];

  @ApiProperty({
    name: 'TotalFare',
    title: 'TotalFare',
    description: 'TotalFare of Mystifly Search Results',
    type: 'string',
    example: '957.08',
  })
  TotalFare: string;

  @ApiPropertyOptional({
    name: 'TotalFareWithMarkUp',
    title: 'TotalFareWithMarkUp',
    description: 'TotalFareWithMarkUp of Mystifly Search Results',
    type: 'string',
    example: '957.08',
  })
  TotalFareWithMarkUp?: string;
}

class FlightFares {
  @ApiProperty({
    name: 'FareType',
    title: 'FareType',
    description: 'FareType of Mystifly Search Results',
    type: 'string',
    example: 'Public',
  })
  FareType: string;

  @ApiProperty({
    name: 'Currency',
    title: 'Currency',
    description: 'Currency of Mystifly Search Results',
    type: 'string',
    example: 'USD',
  })
  Currency: string;

  @ApiProperty({
    name: 'PassengerFare',
    title: 'PassengerFare',
    description: 'PassengerFare of Mystifly Search Results',
    type: [PassengerFare],
  })
  PassengerFare: PassengerFare[];

  @ApiProperty({
    name: 'FareRef',
    title: 'FareRef',
    description: 'FareRef of Mystifly Search Results',
    type: 'number',
    example: 7,
  })
  FareRef: number;
}

class Penaltydetails {
  @ApiProperty({
    name: 'PaxType',
    title: 'PaxType',
    description: 'PaxType of Mystifly Search Results',
    type: 'string',
    example: 'ADT',
  })
  PaxType: string;

  @ApiProperty({
    name: 'RefundPenaltyAmount',
    title: 'RefundPenaltyAmount',
    description: 'RefundPenaltyAmount of Mystifly Search Results',
    type: 'string',
    example: '14345',
  })
  RefundPenaltyAmount: string;

  @ApiProperty({
    name: 'RefundAllowed',
    title: 'RefundAllowed',
    description: 'RefundAllowed of Mystifly Search Results',
    type: 'boolean',
    example: 'true',
  })
  RefundAllowed: boolean;

  @ApiProperty({
    name: 'Currency',
    title: 'Currency',
    description: 'Currency of Mystifly Search Results',
    type: 'string',
    example: 'INR',
  })
  Currency: string;

  @ApiProperty({
    name: 'ChangePenaltyAmount',
    title: 'ChangePenaltyAmount',
    description: 'ChangePenaltyAmount of Mystifly Search Results',
    type: 'string',
    example: '8240',
  })
  ChangePenaltyAmount: string;

  @ApiProperty({
    name: 'ChangeAllowed',
    title: 'ChangeAllowed',
    description: 'ChangeAllowed of Mystifly Search Results',
    type: 'boolean',
    example: 'true',
  })
  ChangeAllowed: boolean;
}

class PenaltiesInfo {
  @ApiProperty({
    name: 'Penaltydetails',
    title: 'Penaltydetails',
    description: 'Penaltydetails of Mystifly Search Results',
    type: [Penaltydetails],
  })
  Penaltydetails: Penaltydetails[];

  @ApiProperty({
    name: 'PenaltiesInfoRef',
    title: 'PenaltiesInfoRef',
    description: 'PenaltiesInfoRef of Mystifly Search Results',
    type: 'number',
    example: 1,
  })
  PenaltiesInfoRef: number;
}

export class MystiflySearch {
  @ApiProperty({
    name: 'FareSourceCode',
    title: 'FareSourceCode',
    description: 'FareSourceCode of Mystifly Search Results',
    type: 'string',
    example:
      'MzQwOWcwY0JPSFpvdTBmSWpCME5tTHFUL0ZaT242MGNCWWFCdmxYNy9tMUQwSklKN2k1RDJoenlMUnNReXJBYzRmUW5oUENBYk5ib0M1a0p1ek5BSDJxR1VMY3pFb3lKRkZVa1dIU2hEakVER1RwaDBEbFY4VU5OaC9ja0xUNUZ5bjFzQ2RCbVZTVGpSMGozVStvQnNBPT0=',
  })
  FareSourceCode: string;

  @ApiProperty({
    name: 'ValidatingCarrier',
    title: 'ValidatingCarrier',
    description: 'ValidatingCarrier of Mystifly Search Results',
    type: 'string',
    example: 'PR',
  })
  ValidatingCarrier: string;

  @ApiProperty({
    name: 'OriginDestinations',
    title: 'OriginDestinations',
    description: 'OriginDestinations of Mystifly Search Results',
    type: [OriginDestinations],
  })
  OriginDestinations: OriginDestinations[];

  @ApiProperty({
    name: 'FlightFares',
    title: 'FlightFares',
    description: 'FlightFares of Mystifly Search Results',
    type: FlightFares,
  })
  FlightFares: FlightFares;

  @ApiProperty({
    name: 'PenaltiesInfo',
    title: 'PenaltiesInfo',
    description: 'PenaltiesInfo of Mystifly Search Results',
    type: PenaltiesInfo,
  })
  PenaltiesInfo: PenaltiesInfo;

  @ApiProperty({
    name: 'Provider',
    title: 'Provider',
    description: 'Provider of Mystifly Search Results',
    type: 'string',
    example: 'MYSTIFLY',
  })
  Provider: string;
}

class MystiflyDataClass {
  @ApiProperty({
    name: 'economy',
    title: 'economy',
    description: 'economy Data of mystifly data of search results',
    type: [MystiflySearch],
  })
  economy: MystiflySearch[];

  @ApiProperty({
    name: 'business',
    title: 'business',
    description: 'business Data of mystifly data of search results',
    type: [MystiflySearch],
  })
  business: MystiflySearch[];

  @ApiProperty({
    name: 'first',
    title: 'first',
    description: 'first Data of mystifly data of search results',
    type: [MystiflySearch],
  })
  first: MystiflySearch[];

  @ApiProperty({
    name: 'premiumEconomy',
    title: 'premiumEconomy',
    description: 'premiumEconomy Data of mystifly data of search results',
    type: [MystiflySearch],
  })
  premiumEconomy: MystiflySearch[];
}

export class MystiflySearchResponseDto {
  @ApiProperty({
    name: 'Data',
    title: 'Data',
    description: 'Data of mystifly data of search results',
    type: MystiflyDataClass,
  })
  Data: MystiflyDataClass;

  @ApiProperty({
    name: 'ConversationId',
    title: 'ConversationId',
    description: 'ConversationId of mystifly data of search results',
    type: 'string',
    example: '9de166f7-0f1f-4465-bc90-2e8efab85761',
  })
  ConversationId: string;
}

export class MystiflyData {
  @ApiProperty({
    name: 'mystifly',
    title: 'mystifly',
    description: 'mystifly data of search results',
    type: MystiflySearchResponseDto,
  })
  mystifly: MystiflySearchResponseDto;
}

export class OneWaySearchFlightsResponseDto {
  @ApiProperty({
    name: 'statusCode',
    title: 'statusCode',
    description: 'status code',
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'data',
    title: 'data',
    description: 'data of search results',
    type: MystiflyData,
  })
  data: MystiflyData;
}
