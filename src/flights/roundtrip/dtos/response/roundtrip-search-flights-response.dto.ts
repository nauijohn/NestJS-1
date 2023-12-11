import { ApiProperty } from '@nestjs/swagger';

import { MystiflySearchResponseDto } from '../../../../flights/one-way/dtos/response/one-way-search-flights-response.dto';

// export class RoundtripSearchFlightsResponseDto extends OneWaySearchFlightsResponseDto {}

class MystiflyRoundtripData {
  @ApiProperty({
    name: 'departureFlights',
    title: 'departureFlights',
    description: 'departureFlights data of search results',
    type: MystiflySearchResponseDto,
  })
  departureFlights: MystiflySearchResponseDto;

  @ApiProperty({
    name: 'returnFlights',
    title: 'returnFlights',
    description: 'returnFlights data of search results',
    type: MystiflySearchResponseDto,
  })
  returnFlights: MystiflySearchResponseDto;
}
export class RoundtripData {
  @ApiProperty({
    name: 'mystifly',
    title: 'mystifly',
    description: 'mystifly data of search results',
    type: MystiflyRoundtripData,
  })
  mystifly: MystiflyRoundtripData;
}

export class RoundtripSearchFlightsResponseDto {
  @ApiProperty({
    name: 'statusCode',
    title: 'statusCode',
    description: 'status code',
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'data',
    title: 'data',
    description: 'data of search results',
    type: RoundtripData,
  })
  data: RoundtripData;
}
