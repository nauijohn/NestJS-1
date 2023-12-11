import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifyPasswordLocalUserRequestDto {
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
    title: 'oldPassword',
    name: 'oldPassword',
    description: 'user oldPassword',
    required: true,
    example: 'P@ssw0rd!',
  })
  oldPassword: string;
}
