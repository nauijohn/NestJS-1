import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

@Entity({ name: 'tbo_hotel_book_responses' })
export class TboHotelBookResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  clientReferenceId: string;

  @Column()
  @AutoMap()
  confirmationNumber: string;

  @Column()
  @AutoMap()
  providerReference: string;

  @Column()
  @AutoMap()
  paymentReferenceNumber: string;

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
