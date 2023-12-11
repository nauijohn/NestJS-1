import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateIataCodeRequestDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  iataCode: string;
}
