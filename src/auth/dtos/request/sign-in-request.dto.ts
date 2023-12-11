import { IsEmail, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @IsEmail()
  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'email',
    description: 'email address of user',
    required: true,
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'password',
    description: 'password of user',
    required: true,
    example: 'P@ssw0rd!',
  })
  password: string;
}
