import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  gender,
  mealPreference,
  passengerTitle,
  passengerType,
  seatPreferences,
  ssrCode,
  target,
} from '../../constants/validation.constant';

class PassengerName {
  @IsNotEmpty()
  @IsString()
  @IsIn(passengerTitle)
  @ApiProperty({
    name: 'PassengerTitle',
    title: 'PassengerTitle',
    description: 'PassengerTitle',
    type: 'string',
    example: 'MR',
  })
  PassengerTitle: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'PassengerFirstName',
    title: 'PassengerFirstName',
    description: 'PassengerFirstName',
    type: 'string',
    example: 'MOHAMMED',
  })
  PassengerFirstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'PassengerLastName',
    title: 'PassengerLastName',
    description: 'PassengerLastName',
    type: 'string',
    example: 'MUBARAK',
  })
  PassengerLastName: string;
}

class Passport {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'PassportNumber',
    title: 'PassportNumber',
    description: 'PassportNumber',
    type: 'string',
    example: 'Z876789',
  })
  PassportNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /(^((\d{4}-(((0[13578]|[1][02])-(0[1-9]|[1-2]\d|3[01]))))|((\d{4}-(((0[469]|[1][1])-(0[1-9]|[1-2]\d|[3][0])))))|((\d{4}-(0[2]-(0[1-9]|[1-2]\d)))))T(([01]\d|2[0-3]):([0-5]\d):([0-5]\d))$)/gm,
  )
  @ApiProperty({
    name: 'ExpiryDate',
    title: 'ExpiryDate',
    description: 'ExpiryDate',
    type: 'string',
    example: '2025-01-03T00:00:00',
  })
  ExpiryDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'Country',
    title: 'Country',
    description: 'Country',
    type: 'string',
    example: 'IN',
  })
  Country: string;
}

class RequestSSRs {
  @IsOptional()
  @IsString()
  @IsIn(ssrCode)
  @ApiPropertyOptional({
    name: 'SSRCode',
    title: 'SSRCode',
    description: 'SSRCode',
    type: 'string',
    example: 'Any',
  })
  SSRCode: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'FreeText',
    title: 'FreeText',
    description: 'FreeText',
    type: 'string',
    example: 'Meal MOML',
  })
  FreeText: string;
}

class RequestedSegments {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'Origin',
    title: 'Origin',
    description: 'Origin',
    type: 'string',
    example: 'BLR',
  })
  Origin: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'Destination',
    title: 'Destination',
    description: 'Destination',
    type: 'string',
    example: 'DXB',
  })
  Destination: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'FlightNumber',
    title: 'FlightNumber',
    description: 'FlightNumber',
    type: 'string',
    example: 'EK569',
  })
  FlightNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /(^((\d{4}-(((0[13578]|[1][02])-(0[1-9]|[1-2]\d|3[01]))))|((\d{4}-(((0[469]|[1][1])-(0[1-9]|[1-2]\d|[3][0])))))|((\d{4}-(0[2]-(0[1-9]|[1-2]\d)))))T(([01]\d|2[0-3]):([0-5]\d):([0-5]\d))$)/gm,
  )
  @ApiProperty({
    name: 'DepartureDateTime',
    title: 'DepartureDateTime',
    description: 'DepartureDateTime',
    type: 'string',
    example: '2020-02-03T00:00:00',
  })
  DepartureDateTime: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestedSegments)
  @ApiPropertyOptional({
    name: 'RequestSSRs',
    title: 'RequestSSRs',
    description: 'RequestSSRs',
    type: [RequestSSRs],
  })
  RequestSSRs?: RequestSSRs[];
}

class SpecialServiceRequest {
  @IsNotEmpty()
  @IsString()
  @IsIn(seatPreferences)
  @ApiProperty({
    name: 'SeatPreference',
    title: 'SeatPreference',
    description: 'SeatPreference',
    type: 'string',
    example: 'Any',
  })
  SeatPreference: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(mealPreference)
  @ApiProperty({
    name: 'MealPreference',
    title: 'MealPreference',
    description: 'MealPreference',
    type: 'string',
    example: 'Any',
  })
  MealPreference: string;

  @IsArray()
  // @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RequestedSegments)
  @ApiProperty({
    name: 'RequestedSegments',
    title: 'RequestedSegments',
    description: 'RequestedSegments',
    type: [RequestedSegments],
  })
  RequestedSegments: RequestedSegments[];
}

class AirTravelers {
  @IsNotEmpty()
  @IsString()
  @IsIn(passengerType)
  @ApiProperty({
    name: 'PassengerType',
    title: 'PassengerType',
    description: 'PassengerType',
    type: 'string',
    example: 'ADT',
  })
  PassengerType: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(gender)
  @ApiProperty({
    name: 'Gender',
    title: 'Gender',
    description: 'Gender',
    type: 'string',
    example: 'M',
  })
  Gender: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => PassengerName)
  @ApiProperty({
    name: 'PassengerName',
    title: 'PassengerName',
    description: 'PassengerName',
    type: PassengerName,
  })
  PassengerName: PassengerName;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /(^((\d{4}-(((0[13578]|[1][02])-(0[1-9]|[1-2]\d|3[01]))))|((\d{4}-(((0[469]|[1][1])-(0[1-9]|[1-2]\d|[3][0])))))|((\d{4}-(0[2]-(0[1-9]|[1-2]\d)))))T(([01]\d|2[0-3]):([0-5]\d):([0-5]\d))$)/gm,
  )
  @ApiProperty({
    name: 'DateOfBirth',
    title: 'DateOfBirth',
    description: 'DateOfBirth',
    type: 'string',
    example: '1988-01-03T00:00:00',
  })
  DateOfBirth: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Passport)
  @ApiProperty({
    name: 'Passport',
    title: 'Passport',
    description: 'Passport',
    type: Passport,
  })
  Passport: Passport;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => SpecialServiceRequest)
  @ApiProperty({
    name: 'SpecialServiceRequest',
    title: 'SpecialServiceRequest',
    description: 'SpecialServiceRequest',
    type: SpecialServiceRequest,
  })
  SpecialServiceRequest: SpecialServiceRequest;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'PassengerNationality',
    title: 'PassengerNationality',
    description: 'PassengerNationality',
    type: 'string',
    example: 'IN',
  })
  PassengerNationality: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'NationalID',
    title: 'NationalID',
    description: 'NationalID',
    type: 'string',
    example: 'IN',
  })
  NationalID?: string;
}

export class TravelerInfo {
  @IsArray()
  @ApiProperty({
    name: 'AirTravelers',
    title: 'AirTravelers',
    description: 'AirTravelers',
    type: [AirTravelers],
  })
  AirTravelers: AirTravelers[];

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    name: 'CountryCode',
    title: 'CountryCode',
    description: 'CountryCode',
    type: 'string',
    example: '91',
  })
  CountryCode: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    name: 'AreaCode',
    title: 'AreaCode',
    description: 'AreaCode',
    type: 'string',
    example: '080',
  })
  AreaCode: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    name: 'PhoneNumber',
    title: 'PhoneNumber',
    description: 'PhoneNumber',
    type: 'string',
    example: '87657897',
  })
  PhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    name: 'Email',
    title: 'Email',
    description: 'Email',
    type: 'string',
    example: 'apisupport@mystifly.com',
  })
  Email: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    name: 'PostCode',
    title: 'PostCode',
    description: 'PostCode',
    type: 'string',
    example: '560028',
  })
  PostCode: string;
}

export class MystiflyBookRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'FareSourceCode',
    title: 'FareSourceCode',
    description: 'FareSourceCode',
    type: 'string',
    example:
      'T2pUempGdEdBTGxSMk4zNWQ4cEVZTjV2NFVvS0xLR3ZReExnRVdNUS9FQWtTb2R1UGFrcTZLU2R6dlhSTVJwWFJNd1c2OE5Eang5MGlUWW5XbkE2d1NsemtLZ0luVk9RLytlRGg1cUNmcjd2SktLK3NVZE9Ob1FsV3Z1WFRMRjdKM0xUQlVlSThOT1VTQURHZDYvcGd3PT0=',
  })
  FareSourceCode: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TravelerInfo)
  @ApiProperty({
    name: 'TravelerInfo',
    title: 'TravelerInfo',
    description: 'TravelerInfo',
    type: TravelerInfo,
  })
  TravelerInfo: TravelerInfo;

  @IsOptional()
  @IsString()
  @IsIn(target)
  @ApiPropertyOptional({
    name: 'Target',
    title: 'Target',
    description: 'Target',
    type: 'string',
    example: 'Test',
  })
  Target?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'ConversationId',
    title: 'ConversationId',
    description: 'ConversationId',
    type: 'string',
    example: '3c07d5c1-387b-42d8-8d91-349fbea1938b',
  })
  ConversationId?: string;
}
