import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsArray,
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { FacebookUser } from '../../../../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../../../../users/local-users/local-user.schema';

export class CreateTravelerDetailRequestDto {
  @IsOptional()
  user?: LocalUser | FacebookUser | string = null;

  @IsOptional()
  signAs?: string = null;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
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
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'middleName',
    name: 'middleName',
    description: 'middle name of user',
    required: true,
    example: 'Marquez',
  })
  middleName: string = null;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'title',
    name: 'title',
    description: 'title of user',
    required: true,
    example: 'male',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'nationality',
    name: 'nationality',
    description: 'nationality of user',
    required: true,
    example: 'Filipino',
  })
  nationality: string;

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

  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @ApiProperty({
    type: 'string',
    title: 'passportNumber',
    name: 'passportNumber',
    description: 'passport number of user',
    required: false,
    example: '',
  })
  passportNumber?: string = null;

  @IsOptional()
  @IsDateString({ strict: true, strictSeparator: true })
  @ApiProperty({
    type: 'string',
    title: 'expirationDate',
    name: 'expirationDate',
    description: 'expiration date of user passport in YYYY-MM-DD string format',
    required: false,
    example: '1990-12-27',
  })
  expirationDate?: string = null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    title: 'countryIssued',
    name: 'countryIssued',
    description: 'country issued of user passport',
    required: false,
    example: 'Philippines',
  })
  countryIssued?: string = null;

  @IsOptional()
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
  email?: string = null;

  @IsOptional()
  @IsString()
  @IsNumberString()
  @IsMobilePhone()
  @MinLength(2)
  @MaxLength(255)
  @ApiProperty({
    type: 'string',
    title: 'mobileNumber',
    name: 'mobileNumber',
    description: 'mobile number of user',
    required: true,
    example: '+639999999999',
  })
  mobileNumber?: string = null;
}

export class CreateTravelerDetailsRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTravelerDetailRequestDto)
  @ApiProperty({
    type: [CreateTravelerDetailRequestDto],
    title: 'data',
    name: 'data',
    description: 'data of user traveler details',
    required: true,
  })
  data: CreateTravelerDetailRequestDto[];
}
