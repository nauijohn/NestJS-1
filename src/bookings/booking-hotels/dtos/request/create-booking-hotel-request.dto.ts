import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import * as moment from 'moment';

import { AutoMap } from '@automapper/classes';

import { HotelProvider } from '../../hotel-provider.enum';

class PaymentHotelDetail {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  amount?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  discount?: number;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}

class CustomerDetail {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  mobileNumber: string;
}

export class CreateBookingHotelRequestDto {
  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => moment(value).format('YYYY-MM-DD'))
  @AutoMap()
  checkInDate?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => moment(value).format('YYYY-MM-DD'))
  @AutoMap()
  checkOutDate?: Date;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  adults?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  rooms?: number;

  @IsOptional()
  @IsEnum(HotelProvider)
  @AutoMap()
  provider?: HotelProvider;

  @IsOptional()
  providerDetails?: any;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentHotelDetail)
  paymentHotelDetail?: PaymentHotelDetail;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CustomerDetail)
  customerDetail?: CustomerDetail;
}
