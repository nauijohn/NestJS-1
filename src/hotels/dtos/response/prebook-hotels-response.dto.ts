import { ApiProperty } from '@nestjs/swagger';

import { TboPreBookHotelResult } from '../../../providers/tbo/hotel-utils/hotels/dtos/response/tbo-pre-book-hotels-response.dto';

class TboPreBookData {
  @ApiProperty({
    name: 'tbo',
    title: 'tbo',
    description: 'tbo data of responsesssss',
    type: TboPreBookHotelResult,
  })
  tbo: TboPreBookHotelResult[];
}

export class PreBookHotelsResponseDto {
  @ApiProperty({
    name: 'statusCode',
    title: 'statusCode',
    description: 'statusCode of resonse',
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'data',
    title: 'data',
    description: 'data of responsesss',
    type: TboPreBookData,
  })
  data: TboPreBookData;
}
