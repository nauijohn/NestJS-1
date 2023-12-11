import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'email',
    name: 'email',
    description: 'user email',
    required: true,
    example: 'test@test.com',
  })
  email: string;

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
    title: 'password',
    name: 'password',
    description: 'user password',
    required: true,
    example: 'P@ssw0rd!',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'firstName',
    name: 'firstName',
    description: 'given name of user',
    required: true,
    example: 'John',
  })
  firstName: string;

  @IsOptional()
  @IsString()
  // @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'middleName',
    name: 'middleName',
    description: 'middle name of user',
    required: true,
    example: 'Marquez',
  })
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'lastName',
    name: 'lastName',
    description: 'family name of user',
    required: true,
    example: 'Doe',
  })
  lastName: string;

  @IsOptional()
  @IsString()
  // @IsNumberString()
  // @IsMobilePhone()
  // @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'mobileNumber',
    name: 'mobileNumber',
    description: 'mobile number of user',
    required: true,
    example: '+639999999999',
  })
  mobileNumber: string;

  @IsNotEmpty()
  @IsDateString({ strict: true, strictSeparator: true })
  @ApiProperty({
    type: 'string',
    title: 'birthDate',
    name: 'birthDate',
    description: 'birth date of user in YYYY-MM-DD string format',
    required: true,
    example: '1990-12-27',
  })
  birthDate: string;
}
