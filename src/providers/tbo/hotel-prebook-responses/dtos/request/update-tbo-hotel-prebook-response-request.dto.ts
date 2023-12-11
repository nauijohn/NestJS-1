import { PartialType } from '@nestjs/swagger';

import { CreateTboHotelPrebookResponseRequestDto } from './create-tbo-hotel-prebook-response-request.dto';

export class UpdateTboHotelPrebookResponseRequestDto extends PartialType(
  CreateTboHotelPrebookResponseRequestDto,
) {
  id: number;
}
