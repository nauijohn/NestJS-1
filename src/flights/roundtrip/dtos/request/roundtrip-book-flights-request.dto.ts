import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { TravelerInfo } from '../../../../providers/mystifly/flight-utils/dtos/request/mystifly-book-request.dto';

class RoundtripBookDetails {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'fareSourceCode',
    title: 'fareSourceCode',
    description: 'FareSourceCode',
    type: 'string',
    example:
      'MzQwOWcwY0JPSFpvdTBmSWpCME5tQnBBTVF1ekRDdWJvYnU5dDcvdVFMclRiWEdRVWhPWFdTVy9IalVtamJXVEdTRHNkYlUxNXJlQ3FxL1J3V1ViUTQwWjJmd3RtMVZQSGxrR3J3SUIzWEV6ejE5c0pxMDF0RjJzYktOa01XVkZpdENsQ3VZT0NmNFp5L3ZMVnhPUEVBPT0=',
  })
  fareSourceCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'conversationId',
    title: 'conversationId',
    description: 'ConversationId',
    type: 'string',
    example: '977c9cfe-f319-4e93-933f-f3f07fc93e10',
  })
  conversationId: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => TravelerInfo)
  @ApiProperty({
    name: 'TravelerInfo',
    title: 'TravelerInfo',
    description: 'TravelerInfo',
    type: TravelerInfo,
  })
  TravelerInfo: TravelerInfo;
}

export class RoundtripBookFlightsRequestDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => RoundtripBookDetails)
  @ApiProperty({
    name: 'departureDetails',
    title: 'departureDetails',
    description: 'departureDetails',
    type: RoundtripBookDetails,
  })
  departureDetails: RoundtripBookDetails;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => RoundtripBookDetails)
  @ApiProperty({
    name: 'returnDetails',
    title: 'returnDetails',
    description: 'returnDetails',
    type: RoundtripBookDetails,
  })
  returnDetails: RoundtripBookDetails;
}
