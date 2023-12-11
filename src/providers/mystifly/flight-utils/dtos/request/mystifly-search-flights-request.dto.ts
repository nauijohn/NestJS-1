import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsAlpha,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  airTripType,
  cabinPreference,
  maxStopsQuantity,
  passengerType,
  preferenceLevel,
  pricingSourceType,
  requestOptions,
  target,
} from '../../constants/validation.constant';

class PassengerTypeQuantitiesDto {
  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(3)
  @IsIn(passengerType)
  @ApiProperty({
    name: 'Code',
    title: 'Code',
    description: 'Code of passenger',
    type: 'string',
    example: 'ADT',
    enum: ['ADT', 'CHD', 'INF'],
  })
  Code: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    name: 'Quantity',
    title: 'Quantity',
    description: 'Quantity of passengers',
    type: 'number',
    example: 1,
  })
  Quantity: number;
}

class CabinClassPreferenceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'CabinType',
    title: 'CabinType',
    description: 'Cabin type',
    type: 'string',
    example: 'Y',
    enum: ['Y', 'S', 'C', 'F'],
  })
  CabinType: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(preferenceLevel)
  @ApiProperty({
    name: 'PreferenceLevel',
    title: 'PreferenceLevel',
    description: 'Preference level',
    type: 'string',
    example: 'Restricted',
    enum: ['Preferred', 'Restricted'],
  })
  PreferenceLevel: string;
}

export class OriginDestinationInformationsDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/g)
  @ApiProperty({
    name: 'DepartureDateTime',
    title: 'DepartureDateTime',
    description: 'Departure date time',
    type: 'string',
    example: '2020-02-03T00:00:00',
  })
  DepartureDateTime: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(3)
  @ApiProperty({
    name: 'OriginLocationCode',
    title: 'OriginLocationCode',
    description: 'Origin location code',
    type: 'string',
    example: 'DXB',
  })
  OriginLocationCode: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(3)
  @ApiProperty({
    name: 'DestinationLocationCode',
    title: 'DestinationLocationCode',
    description: 'Destination location code',
    type: 'string',
    example: 'BLR',
  })
  DestinationLocationCode: string;
}

class Preferences {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => CabinClassPreferenceDto)
  @ApiProperty({
    name: 'CabinClassPreference',
    title: 'CabinClassPreference',
    description: 'Cabin class preference of travel',
    type: CabinClassPreferenceDto,
  })
  CabinClassPreference: CabinClassPreferenceDto;
}

class TravelPreferencesDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(maxStopsQuantity)
  @ApiProperty({
    name: 'MaxStopsQuantity',
    title: 'MaxStopsQuantity',
    description: 'Max stops quantity of travel',
    type: 'string',
    example: 'All',
    enum: ['Direct', 'OneStop', 'All'],
  })
  MaxStopsQuantity: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(cabinPreference)
  @ApiProperty({
    name: 'CabinPreference',
    title: 'CabinPreference',
    description: 'CabinPreference of travel',
    type: 'string',
    example: 'Y',
    enum: ['Y', 'S', 'C', 'F'],
  })
  CabinPreference: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Preferences)
  @ApiProperty({
    name: 'Preferences',
    title: 'Preferences',
    description: 'Preferences of travel',
    type: Preferences,
  })
  Preferences: Preferences;

  @IsNotEmpty()
  @IsString()
  @IsIn(airTripType)
  @ApiProperty({
    name: 'AirTripType',
    title: 'AirTripType',
    description: 'Air trip type',
    type: 'string',
    example: 'Return',
    enum: ['OneWay', 'Return', 'OpenJaw', 'Circle'],
  })
  AirTripType: string;
}

@ValidatorConstraint({ name: 'hasAtLeastOneADT' })
class HasAtLeastOneADT implements ValidatorConstraintInterface {
  validate(passengerTypeQuantities: PassengerTypeQuantitiesDto[]): boolean {
    for (const passengerTypeQuantity of passengerTypeQuantities) {
      if (passengerTypeQuantity.Code === 'ADT')
        if (passengerTypeQuantity.Quantity >= 1) return true;
    }
    return false;
  }
}

export class MystiflySearchFlightsRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OriginDestinationInformationsDto)
  @ApiProperty({
    name: 'OriginDestinationInformations',
    title: 'OriginDestinationInformations',
    description: 'Origin destination informations',
    type: [OriginDestinationInformationsDto],
  })
  OriginDestinationInformations: OriginDestinationInformationsDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerTypeQuantitiesDto)
  @Validate(HasAtLeastOneADT, {
    message: 'Should contain at least one ADT passenger',
  })
  @ApiProperty({
    name: 'PassengerTypeQuantities',
    title: 'PassengerTypeQuantities',
    description: 'Passenger type quantities',
    type: [PassengerTypeQuantitiesDto],
  })
  PassengerTypeQuantities: PassengerTypeQuantitiesDto[];

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TravelPreferencesDto)
  @ApiProperty({
    name: 'TravelPreferences',
    title: 'TravelPreferences',
    description: 'Travel preferences',
    type: TravelPreferencesDto,
  })
  TravelPreferences: TravelPreferencesDto;

  @IsOptional()
  @IsString()
  @IsIn(pricingSourceType)
  @ApiPropertyOptional({
    name: 'PricingSourceType',
    title: 'PricingSourceType',
    description: 'Pricing source type',
    type: 'string',
    example: 'Public',
    enum: ['Public', 'Private'],
  })
  PricingSourceType?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    name: 'IsRefundable',
    title: 'IsRefundable',
    description: 'Is refundable',
    type: 'boolean',
    example: true,
  })
  IsRefundable?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(requestOptions)
  @ApiPropertyOptional({
    name: 'RequestOptions',
    title: 'RequestOptions',
    description: 'Request options',
    type: 'string',
    example: 'Fifty',
  })
  RequestOptions?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'Nationality',
    title: 'Nationality',
    description: 'Nationality',
    type: 'string',
    example: 'PH',
  })
  Nationality?: string;

  @IsOptional()
  @IsString()
  @IsIn(target)
  @ApiPropertyOptional({
    name: 'Target',
    title: 'Target',
    description: 'Target',
    type: 'string',
    example: 'Test',
    enum: ['Test', 'Prod'],
  })
  Target?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    name: 'ConversationId',
    title: 'ConversationId',
    description: 'ConversationId',
    type: 'string',
    example: 'Test',
  })
  ConversationId?: string;
}
