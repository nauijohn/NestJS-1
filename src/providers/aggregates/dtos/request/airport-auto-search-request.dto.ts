import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AirportAutoSearchRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    title: 'keyword',
    name: 'keyword',
    description: 'query keyword',
    example: 'manila',
  })
  keyword: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    type: 'string',
    title: 'page',
    name: 'page',
    description: 'query page',
    example: '1',
  })
  page?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    type: 'string',
    title: 'pagination',
    name: 'pagination',
    description: 'query pagination',
    example: '999',
  })
  pagination?: string;
}
