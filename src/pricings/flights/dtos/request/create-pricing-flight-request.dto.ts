import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { IataCode } from '../../../../iataCodes/iata-code.entity';
import { CabinClass } from '../../cabin-class.enum';
import { PriceMargin } from '../../price-margin.enum';

export class CreatePricingFlightRequestDto {
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => IataCode)
  iataCode: IataCode;

  @IsNotEmpty()
  @IsNumber()
  fixedAmount: number;

  @IsNotEmpty()
  @IsNumber()
  percentage: number;

  @IsNotEmpty()
  @IsEnum(CabinClass)
  cabinClass: CabinClass;

  @IsNotEmpty()
  @IsEnum(PriceMargin)
  priceMargin: PriceMargin;
}
