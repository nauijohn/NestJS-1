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

import { AutoMap } from '@automapper/classes';

import { BookingHotel } from '../../bookings/booking-hotels/booking-hotel.entity';
import { PaymentHotel } from '../../payments/payment-hotels/payment-hotel.entity';
import { PrebookingHotel } from '../../prebookings/prebooking-hotels/prebooking-hotel.entity';

@Entity({ name: 'transaction_hotels' })
export class TransactionHotel {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  transactionId: string;

  @Column()
  @AutoMap()
  location: string;

  @Column()
  @AutoMap()
  adults: number;

  @Column()
  @AutoMap()
  rooms: number;

  @Column({ type: 'date' })
  @AutoMap()
  checkInDate: Date;

  @Column({ type: 'date' })
  @AutoMap()
  checkOutDate: Date;

  @OneToOne(() => PrebookingHotel, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @AutoMap()
  prebookingHotel?: PrebookingHotel;

  @OneToMany(
    () => BookingHotel,
    (bookingHotel) => bookingHotel.transactionHotel,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  @AutoMap(() => [BookingHotel])
  bookingHotels?: BookingHotel[];

  @OneToOne(() => PaymentHotel, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @AutoMap()
  paymentHotel?: PaymentHotel;

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
