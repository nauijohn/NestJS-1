import { IsArray, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PreBookHotelsRequestDto {
  @IsNotEmpty()
  // @IsString()
  @IsArray()
  @ApiProperty({
    type: Array<string>,
    required: true,
    title: 'bookingCode',
    name: 'bookingCode',
    description: 'bookingCode hotel in search',
    example: ['1188733!TB!1!TB!f488e915-fe4a-4f98-b906-6c328a56a8b3'],
  })
  bookingCodes: string[];
}
