import { IsNotEmpty, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { OneWaySearchFlightsRequestDto } from '../../../../flights/one-way/dtos/request/one-way-search-flights-request.dto';

export class RoundtripSearchFlightsRequestDto extends OneWaySearchFlightsRequestDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/g)
  @ApiProperty({
    type: 'string',
    required: true,
    title: 'returnDate',
    name: 'returnDate',
    description: 'return date of user',
    example: '2023/07/23',
  })
  returnDate: string;
}
