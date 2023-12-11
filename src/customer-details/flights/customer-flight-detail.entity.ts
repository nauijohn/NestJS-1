import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookingFlight } from '../../bookings/booking-flights/booking-flight.entity';

@Entity({ name: 'customer_flight_details' })
export class CustomerFlightDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mobileNumber: string;

  @OneToMany(
    () => BookingFlight,
    (bookingFlight) => bookingFlight.customerFlightDetail,
  )
  bookingFlights: BookingFlight[];

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
