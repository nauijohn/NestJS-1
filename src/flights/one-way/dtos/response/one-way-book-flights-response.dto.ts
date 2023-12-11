import { ApiProperty } from '@nestjs/swagger';

import { MystiflyBookData } from '../../../../providers/mystifly/flight-utils/dtos/response/mystifly-book-response.dto';

class OneWayBookFlightsData extends MystiflyBookData {}

export class OneWayBookFlightsResponseDto {
  @ApiProperty({
    name: 'statusCode',
    title: 'statusCode',
    description: 'statusCode of Mystifly Book Results',
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'data',
    title: 'data',
    description: 'data of Mystifly Book Results',
    type: OneWayBookFlightsData,
  })
  data: OneWayBookFlightsData;
}
