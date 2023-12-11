import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

import { target } from '../../constants/validation.constant';

export class MystiflyFareRulesRequestDto {
  @IsOptional()
  @IsString()
  FareSourceCode: string;

  @IsOptional()
  @IsString()
  UniqueID?: string;

  @IsOptional()
  @IsIn(target)
  @IsString()
  Target?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  ConversationId?: string;
}
