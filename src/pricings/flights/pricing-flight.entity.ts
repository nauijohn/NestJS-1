import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IataCode } from '../../iataCodes/iata-code.entity';
import { CabinClass } from './cabin-class.enum';
import { PriceMargin } from './price-margin.enum';

@Entity({ name: 'pricing_flights' })
export class PricingFlight {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IataCode, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  iataCode: IataCode;

  @Column({ type: 'float' })
  fixedAmount: number;

  @Column({ type: 'float' })
  percentage: number;

  @Column()
  cabinClass: CabinClass;

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
