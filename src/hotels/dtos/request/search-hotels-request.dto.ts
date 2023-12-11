import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SearchHotelsRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  location: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  checkInDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  checkOutDate: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  adults: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  children: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rooms: number;
}
