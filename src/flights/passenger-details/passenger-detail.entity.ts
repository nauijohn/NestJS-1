import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookingFlight } from '../../bookings/booking-flights/booking-flight.entity';

@Entity({ name: 'passenger_details' })
export class PassengerDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  nationality?: string;

  @Column()
  birthDate: string;

  @Column({ nullable: true })
  passportNumber?: string;

  @Column({ nullable: true })
  expirationDate?: string;

  @Column({ nullable: true })
  countryIssued?: string;

  @Column({ nullable: true, default: 'ADT' })
  passengerType: string;

  @ManyToMany(
    () => BookingFlight,
    (bookingFlight) => bookingFlight.passengerDetails,
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
