import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class AirportAutoSearchGroupedDataAirport {
  @ApiProperty({
    type: 'string',
    title: 'airportName',
    name: 'airportName',
    description: 'airport name',
    example: 'Ninoy Aquino Intl',
  })
  airportName: string;

  @ApiProperty({
    type: 'string',
    title: 'airportCode',
    name: 'airportCode',
    description: 'airport code',
    example: 'MNL',
  })
  airportCode: string;
}

export class AirportAutoSearchGroupedData {
  @ApiProperty({
    type: 'string',
    title: 'cityName',
    name: 'cityName',
    description: 'city name',
    example: 'Manila',
  })
  cityName: string;

  @ApiProperty({
    type: 'string',
    title: 'cityCode',
    name: 'cityCode',
    description: 'city code',
    example: 'MNL',
  })
  cityCode: string;

  @ApiProperty({
    type: [AirportAutoSearchGroupedDataAirport],
    title: 'description',
    name: 'description',
    description: 'airport of airport auto search grouped data',
  })
  airports: AirportAutoSearchGroupedDataAirport[];
}

export class AirportAutoSearchGroupedResponseDto {
  @ApiProperty({
    type: 'number',
    title: 'statusCode',
    name: 'statusCode',
    description: 'status code',
    example: 200,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    type: [AirportAutoSearchGroupedData],
    title: 'data',
    name: 'data',
    description: 'airport auto search grouped data',
  })
  data: AirportAutoSearchGroupedData[];
}
