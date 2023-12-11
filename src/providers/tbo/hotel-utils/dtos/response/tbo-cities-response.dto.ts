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

class TboCityList {
  @ApiProperty({
    name: 'Code',
    title: 'Code',
    description: 'Code of country',
    type: 'string',
    example: '100834',
  })
  Code: string;

  @ApiProperty({
    name: 'Name',
    title: 'Name',
    description: 'Name of country',
    type: 'string',
    example: 'Alcoy',
  })
  Name: string;
}

export class TboCitiesResponseDto {
  @ApiProperty({
    name: 'Status',
    title: 'Status',
    description: 'Status of TboCitiesResponseDto',
    type: TboStatus,
  })
  Status: TboStatus;

  @ApiProperty({
    name: 'CityList',
    title: 'CityList',
    description: 'CityList of TBO',
    type: [TboCityList],
  })
  CityList: TboCityList[];
}
