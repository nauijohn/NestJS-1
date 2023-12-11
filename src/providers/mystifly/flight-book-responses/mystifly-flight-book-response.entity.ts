import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookingFlight } from '../../../bookings/booking-flights/booking-flight.entity';

@Entity({ name: 'mystifly_flight_book_responses' })
export class MystiflyFlightBookResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  clientUTCOffset: number;

  @Column()
  conversationId: string;

  @Column({ type: 'json' })
  errors: any;

  @Column()
  status: string;

  @Column({ nullable: true })
  tktTimeLimit: string;

  @Column()
  traceId: string;

  @Column()
  uniqueID: string;

  @Column()
  providerReference: string;

  @Column()
  paymentReferenceNumber: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @Column({ nullable: true })
  fareSourceCode: string;

  @OneToOne(() => BookingFlight)
  @JoinColumn()
  bookingFlight: BookingFlight;

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
