import { ApiProperty } from '@nestjs/swagger';

class MystiflyFareRulesRuleDetails {
  @ApiProperty({
    name: 'Category',
    title: 'Category',
    description: 'Category of Mystifly FareRules ResponseDto',
    type: 'string',
    example: 'GENERAL',
  })
  Category: string;

  @ApiProperty({
    name: 'Rules',
    title: 'Rules',
    description: 'Rules of Mystifly FareRules ResponseDto',
    type: 'string',
    example: '',
  })
  Rules: string;
}
export class MystiflyFareRulesFareRules {
  @ApiProperty({
    name: 'Airline',
    title: 'Airline',
    description: 'Airline of Mystifly FareRules ResponseDto',
    type: 'string',
    example: '',
  })
  Airline: string;

  @ApiProperty({
    name: 'CityPair',
    title: 'CityPair',
    description: 'CityPair of Mystifly FareRules ResponseDto',
    type: 'string',
    example: '',
  })
  CityPair: string;

  @ApiProperty({
    name: 'RuleDetails',
    title: 'RuleDetails',
    description: 'RuleDetails of Mystifly FareRules ResponseDto',
    type: [MystiflyFareRulesRuleDetails],
  })
  RuleDetails: MystiflyFareRulesRuleDetails[];
}

export class MystiflyFareRulesBaggageInfos {
  @ApiProperty({
    name: 'Arrival',
    title: 'Arrival',
    description: 'Arrival of Mystifly FareRules ResponseDto',
    type: 'string',
    example: 'CAN',
  })
  Arrival: string;

  @ApiProperty({
    name: 'Baggage',
    title: 'Baggage',
    description: 'Baggage of Mystifly FareRules ResponseDto',
    type: 'string',
    example: '2PC',
  })
  Baggage: string;

  @ApiProperty({
    name: 'Departure',
    title: 'Departure',
    description: 'Departure of Mystifly FareRules ResponseDto',
    type: 'string',
    example: 'MNL',
  })
  Departure: string;

  @ApiProperty({
    name: 'FlightNo',
    title: 'FlightNo',
    description: 'FlightNo of Mystifly FareRules ResponseDto',
    type: 'string',
    example: 'CZ3092',
  })
  FlightNo: string;
}

export class MystiflyFareRulesData {
  @ApiProperty({
    name: 'BaggageInfos',
    title: 'BaggageInfos',
    description: 'BaggageInfos of Mystifly FareRules ResponseDto',
    type: [MystiflyFareRulesBaggageInfos],
  })
  BaggageInfos: MystiflyFareRulesBaggageInfos[];

  @ApiProperty({
    name: 'ConversationId',
    title: 'ConversationId',
    description: 'ConversationId of Mystifly FareRules ResponseDto',
    type: 'string',
    example: 'ef246e00-593a-45e8-80da-a12c766c7622',
  })
  ConversationId: string;

  @ApiProperty({
    name: 'Errors',
    title: 'Errors',
    description: 'Errors of Mystifly FareRules ResponseDto',
    type: Array<unknown>,
    example: [],
  })
  Errors: Array<unknown>;

  @ApiProperty({
    name: 'FareRules',
    title: 'FareRules',
    description: 'FareRules of Mystifly FareRules ResponseDto',
    type: [MystiflyFareRulesFareRules],
  })
  FareRules: MystiflyFareRulesFareRules[];

  @ApiProperty({
    name: 'Success',
    title: 'Success',
    description: 'Success of Mystifly FareRules ResponseDto',
    type: 'boolean',
    example: true,
  })
  Success: boolean;

  @ApiProperty({
    name: 'Target',
    title: 'Target',
    description: 'Target of Mystifly FareRules ResponseDto',
    type: 'string',
    example: 'Test',
  })
  Target: string;

  @ApiProperty({
    name: 'TraceId',
    title: 'TraceId',
    description: 'TraceId of Mystifly FareRules ResponseDto',
    type: 'string',
    example: '23101808-d3e48cff-6956-47be-a0ec-ce7429d1e5b2',
  })
  TraceId: string;
}

export class MystiflyFareRulesResponseDto {
  Data: MystiflyFareRulesData;
  Success: boolean;
  Message: string;
}
