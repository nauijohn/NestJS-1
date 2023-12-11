import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PriceMargin } from './price-margin.enum';
import { Rating } from './rating.enum';

@Entity({ name: 'pricing_hotels' })
export class PricingHotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision' })
  fixedAmount: number;

  @Column({ type: 'double precision' })
  percentage: number;

  @Column()
  rating: Rating;

  @Column()
  priceMargin: PriceMargin;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
