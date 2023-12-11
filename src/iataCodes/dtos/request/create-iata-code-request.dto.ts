import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIataCodeRequestDto {
  @IsNotEmpty()
  @IsString()
  iataCode: string;
}
