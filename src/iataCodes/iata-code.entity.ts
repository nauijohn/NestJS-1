import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PricingFlight } from '../pricings/flights/pricing-flight.entity';

@Entity({ name: 'iata_codes' })
export class IataCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  iataCode: string;

  @OneToMany(() => PricingFlight, (pricingFlight) => pricingFlight.iataCode)
  pricingFlights: PricingFlight[];

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
