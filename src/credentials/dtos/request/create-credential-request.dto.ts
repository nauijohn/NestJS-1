import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCredentialRequestDto {
  @IsNotEmpty()
  @IsString()
  // @IsEnum(Providers)
  provider: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  bearer: string;

  @IsOptional()
  @IsString()
  clientSecret: string;

  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  accountNumber: string;
}
