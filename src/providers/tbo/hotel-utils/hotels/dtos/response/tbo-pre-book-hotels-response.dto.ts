import { ApiProperty } from '@nestjs/swagger';

import { TboHotelResult, TboStatus } from './tbo-search-hotels-response.dto';

export class TboPreBookHotelResult extends TboHotelResult {
  @ApiProperty({
    name: 'RateConditions',
    title: 'RateConditions',
    description: 'RateConditions of TBO PreBook Results',
    type: Array<string>,
    example: [
      'Early check out will attract full cancellation charge unless otherwise specified.',
      'Please note that this a special rate which should be sold only with an airline ticket as part of a package.',
      'Please refer to the following Terms of Use - http://mytravelagent.online/termsofuse.pdf',
      'CheckIn Time-Begin: 2:00 PM ',
    ],
  })
  RateConditions: string[];
}

export class TboPreBookHotelsResponseDto {
  Status: TboStatus;
  HotelResult: TboPreBookHotelResult[];
}
