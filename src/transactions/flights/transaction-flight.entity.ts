import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BookingFlight } from '../../bookings/booking-flights/booking-flight.entity';
import { FlightType } from '../../bookings/booking-flights/flight-type.enum';
import { PaymentFlight } from '../../payments/payment-flights/payment-flight.entity';
import { PrebookingFlight } from '../../prebookings/prebooking-flights/prebooking-flight.entity';

@Entity({ name: 'transaction_flights' })
export class TransactionFlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flightReference: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  transactionId: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'date' })
  departureDate: Date;

  @Column({ type: 'date', nullable: true })
  returnDate?: Date;

  @Column()
  adults: number;

  @Column({ nullable: true })
  children: number;

  @Column({ nullable: true })
  infants: number;

  @Column()
  cabinClass: string;

  @Column()
  flightType: FlightType;

  @OneToOne(() => PrebookingFlight, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  prebookingFlight: PrebookingFlight;

  @OneToMany(
    () => BookingFlight,
    (bookingFlight) => bookingFlight.transactionFlight,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  bookingFlights: BookingFlight[];

  @OneToOne(() => PaymentFlight, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  paymentFlight: PaymentFlight;

  // @OneToMany(
  //   () => MystiflyFlightFareRulesResponse,
  //   (mystiflyFlightFareRulesResponse) =>
  //     mystiflyFlightFareRulesResponse.transactionFlight,
  // )
  // mystiflyFlightFareRulesResponses: MystiflyFlightFareRulesResponse[];

  // @OneToMany(
  //   () => MystiflyFlightRevalidationResponse,
  //   (mystiflyFlightRevalidationResponse) =>
  //     mystiflyFlightRevalidationResponse.transactionFlight,
  // )
  // mystiflyFlightRevalidationResponses: MystiflyFlightRevalidationResponse[];

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
