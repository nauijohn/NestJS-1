import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRoleRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsAlpha()
  role: string;

  signAs: string;
}
