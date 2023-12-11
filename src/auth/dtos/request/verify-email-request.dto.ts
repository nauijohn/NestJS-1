import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyEmailRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  @MaxLength(255)
  email: string;
}
