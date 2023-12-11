import { PartialType } from '@nestjs/swagger';

import { CreateTboHotelDetailRequestDto } from './create-tbo-hotel-detail-request.dto';

export class UpdateTboHotelDetailRequestDto extends PartialType(
  CreateTboHotelDetailRequestDto,
) {
  id: number;
}
