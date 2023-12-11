import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { IataCode } from '../../../../iataCodes/iata-code.entity';
import { CabinClass } from '../../cabin-class.enum';
import { PriceMargin } from '../../price-margin.enum';

export class UpdatePricingFlightRequestDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IataCode)
  iataCode: IataCode;

  @IsOptional()
  @IsNumber()
  fixedAmount: number;

  @IsOptional()
  @IsNumber()
  percentage: number;

  @IsOptional()
  @IsEnum(CabinClass)
  cabinClass: CabinClass;

  @IsOptional()
  @IsEnum(PriceMargin)
  priceMargin: PriceMargin;
}
