import { ApiProperty } from '@nestjs/swagger';

class TboStatus {
  @ApiProperty({
    name: 'Code',
    title: 'Code',
    description: 'Code of status',
    type: 'number',
    example: 200,
  })
  Code: number;

  @ApiProperty({
    name: 'Description',
    title: 'Description',
    description: 'Description of status',
    type: 'string',
    example: 'Success',
  })
  Description: string;
}

class TboCountryList {
  @ApiProperty({
    name: 'Code',
    title: 'Code',
    description: 'Code of country',
    type: 'string',
    example: 'AL',
  })
  Code: string;

  @ApiProperty({
    name: 'Name',
    title: 'Name',
    description: 'Name of country',
    type: 'string',
    example: 'Albania',
  })
  Name: string;
}

export class TboCountriesResponseDto {
  @ApiProperty({
    name: 'Status',
    title: 'Status',
    description: 'Status of TBO',
    type: TboStatus,
  })
  Status: TboStatus;

  @ApiProperty({
    name: 'CountryList',
    title: 'CountryList',
    description: 'CountryList of TBO',
    type: [TboCountryList],
  })
  CountryList: TboCountryList[];
}
