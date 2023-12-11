import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PaymentStatus } from '../payment-status.enum';

@Entity({ name: 'payment_hotels' })
export class PaymentHotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column()
  name: string;

  @Column({ type: 'double precision', nullable: true })
  amount: number;

  @Column({ nullable: true })
  discount?: number;

  @Column()
  status: PaymentStatus;

  @Column({ unique: true })
  referenceNumber: string;

  @Column({ unique: true })
  paymentIntentId: string;

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
