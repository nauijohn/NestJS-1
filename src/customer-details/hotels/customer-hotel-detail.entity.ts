import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { BookingHotel } from '../../bookings/booking-hotels/booking-hotel.entity';

@Entity({ name: 'customer_hotel_details' })
export class CustomerHotelDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  email: string;

  @Column({ nullable: true })
  @AutoMap()
  mobileNumber: string;

  @OneToMany(
    () => BookingHotel,
    (bookingHotel) => bookingHotel.customerHotelDetail,
  )
  @AutoMap()
  bookingHotels: BookingHotel[];

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
