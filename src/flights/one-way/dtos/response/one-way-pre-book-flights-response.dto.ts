import { ApiProperty } from '@nestjs/swagger';

import { MystiflyFareRulesData } from '../../../../providers/mystifly/flight-utils/dtos/response/mystifly-fare-rules-response.dto';
import { MystiflyRevalidationData } from '../../../../providers/mystifly/flight-utils/dtos/response/mystifly-revalidation-response.dto';

class OneWayPreBookFlightsData {
  @ApiProperty({
    name: 'fareRules',
    title: 'fareRules',
    description: 'fareRules of Mystifly Pre-book Results',
    type: MystiflyFareRulesData,
  })
  fareRules: MystiflyFareRulesData;

  @ApiProperty({
    name: 'revalidation',
    title: 'revalidation',
    description: 'revalidation of Mystifly Pre-book Results',
    type: MystiflyRevalidationData,
  })
  revalidation: MystiflyRevalidationData;
}

export class OneWayPreBookFlightsResponseDto {
  @ApiProperty({
    name: 'statusCode',
    title: 'statusCode',
    description: 'statusCode of Mystifly Pre-book Results',
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'data',
    title: 'data',
    description: 'data of Mystifly Pre-book Results',
    type: OneWayPreBookFlightsData,
  })
  data: OneWayPreBookFlightsData;
}
