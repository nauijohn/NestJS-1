import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordLocalUserRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Passwords must contain at least 1 upper case letter, at least 1 lower case letter, and at least 1 number or special character',
  })
  @ApiProperty({
    type: 'string',
    title: 'newPassword',
    name: 'newPassword',
    description: 'user newPassword',
    required: true,
    example: 'P@ssw0rd!',
  })
  newPassword: string;
}
