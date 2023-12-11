import { AutoMap } from '@automapper/classes';
import { PartialType } from '@nestjs/swagger';

import { CreatePrebookingHotelRequestDto } from './create-prebooking-hotel-request.dto';

export class UpdatePrebookingHotelRequestDto extends PartialType(
  CreatePrebookingHotelRequestDto,
) {
  @AutoMap()
  id: number;
}
