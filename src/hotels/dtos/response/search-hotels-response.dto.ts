import { ApiProperty } from '@nestjs/swagger';

import { TboHotelResult } from '../../../providers/tbo/hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';

class TboData {
  @ApiProperty({
    name: 'tbo',
    title: 'tbo',
    description: 'tbo data of resonse',
    type: [TboHotelResult],
  })
  tbo: TboHotelResult[];
}

export class SearchHotelsResponseDto {
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
    description: 'data of resonse',
    type: TboData,
  })
  data: TboData;
}
