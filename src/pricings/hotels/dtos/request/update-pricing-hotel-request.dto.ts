import { PriceMargin } from '../../price-margin.enum';
import { Rating } from '../../rating.enum';

export class UpdatePricingHotelRequestDto {
  id: number;
  fixedAmount: number;
  percentage: number;
  rating: Rating;
  priceMargin: PriceMargin;
}
