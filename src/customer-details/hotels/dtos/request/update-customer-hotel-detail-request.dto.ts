import { PartialType } from '@nestjs/swagger';

import { CreateCustomerHotelDetailRequestDto } from './create-customer-hotel-detail-request.dto';

export class UpdateCustomerHotelDetailRequestDto extends PartialType(
  CreateCustomerHotelDetailRequestDto,
) {
  id: number;
}
