import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CustomerFlightDetail } from '../../customer-details/flights/customer-flight-detail.entity';
import { PassengerDetail } from '../../flights/passenger-details/passenger-detail.entity';
import { MystiflyFlightDetail } from '../../providers/mystifly/flight-details/mystifly-flight-detail.entity';
import { TransactionFlight } from '../../transactions/flights/transaction-flight.entity';
import { FlightProvider } from './flight-provider.enum';
import { FlightType } from './flight-type.enum';

@Entity({ name: 'booking_flights' })
export class BookingFlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  flightReference: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'date', nullable: true })
  departureDate: Date;

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

  @Column()
  provider: FlightProvider;

  @Column()
  providerReference: string;

  @Column({ nullable: true })
  sequence: number;

  @OneToOne(() => MystiflyFlightDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  mystiflyFlightDetail: MystiflyFlightDetail;

  @ManyToMany(
    () => PassengerDetail,
    (passengerDetail) => passengerDetail.bookingFlights,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @JoinTable({ name: 'passenger_detail_booking_flights_booking_flight' })
  passengerDetails: PassengerDetail[];

  @ManyToOne(() => CustomerFlightDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerFlightDetail: CustomerFlightDetail;

  @ManyToOne(
    () => TransactionFlight,
    (transactionFlight) => transactionFlight.bookingFlights,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  transactionFlight: TransactionFlight;

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
