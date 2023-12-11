import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

class Passengers {
  @Min(1)
  @IsNumber()
  @IsInt()
  @ApiProperty({
    type: 'number',
    required: true,
    title: 'adults',
    name: 'adults',
    description: 'number of adults in passengers',
    example: 1,
  })
  adults: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @ApiProperty({
    type: 'number',
    required: false,
    title: 'children',
    name: 'children',
    description: 'number of children in passengers',
    example: 0,
  })
  children?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @ApiProperty({
    type: 'number',
    required: false,
    title: 'infants',
    name: 'infants',
    description: 'number of infants in passengers',
    example: 0,
  })
  infants?: number;
}

export class OneWaySearchFlightsRequestDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/g)
  @ApiProperty({
    type: 'string',
    required: true,
    title: 'departureDate',
    name: 'departureDate',
    description: 'departure date of user',
    example: '2023/07/23',
  })
  departureDate: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(3)
  @ApiProperty({
    type: 'string',
    required: true,
    title: 'originCode',
    name: 'originCode',
    description: 'origin code of user',
    example: 'MNL',
  })
  originCode: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  @MinLength(3)
  @MaxLength(3)
  @ApiProperty({
    type: 'string',
    required: true,
    title: 'destinationCode',
    name: 'destinationCode',
    description: 'destination code of user',
    example: 'DXB',
  })
  destinationCode: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Passengers)
  @ApiProperty({
    type: Passengers,
    required: true,
    title: 'passengers',
    name: 'passengers',
    description: 'passenger types. must have at least 1 adult.',
    example: { adults: 2, children: 2, infants: 2 },
  })
  passengers: Passengers;

  // @IsOptional()
  // @IsIn(CLASSES)
  // @IsString()
  // @ApiProperty({
  //   type: Passengers,
  //   required: true,
  //   title: 'class',
  //   name: 'class',
  //   description: 'class type of passenger',
  //   example: 'economy',
  //   enum: CLASSES,
  // })
  // class: string;
}
