import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

import { AutoMap } from '@automapper/classes';
import { PartialType } from '@nestjs/swagger';

import { CreateTboHotelBookResponseRequestDto } from './create-tbo-hotel-book-response-request.dto';

export class UpdateTboHotelBookResponseRequestDto extends PartialType(
  CreateTboHotelBookResponseRequestDto,
) {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  @AutoMap()
  id: number;
}
