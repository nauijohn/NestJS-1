import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class TboHotelAutoSearchRequestDto {
  @IsNotEmpty()
  keyword: string;

  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  pagination: string;
}
