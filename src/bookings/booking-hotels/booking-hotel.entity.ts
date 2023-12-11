import { TboHotelBookResponse } from 'src/providers/tbo/hotel-book-responses/tbo-hotel-book-response.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { CustomerHotelDetail } from '../../customer-details/hotels/customer-hotel-detail.entity';
import { TboHotelDetail } from '../../providers/tbo/hotel-details/tbo-hotel-detail.entity';
import { TransactionHotel } from '../../transactions/hotels/transaction-hotel.entity';
import { HotelProvider } from './hotel-provider.enum';

@Entity({ name: 'booking_hotels' })
export class BookingHotel {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: false })
  userId: string;

  @Column({ type: 'date' })
  @AutoMap()
  checkInDate: Date;

  @Column({ type: 'date' })
  @AutoMap()
  checkOutDate: Date;

  @Column()
  adults: number;

  @Column({ nullable: true })
  children: number;

  @Column()
  @AutoMap()
  provider: HotelProvider;

  @Column({ nullable: true })
  providerReference: string;

  @ManyToOne(
    () => TransactionHotel,
    (transactionHotel) => transactionHotel.bookingHotels,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  transactionHotel: TransactionHotel;

  @ManyToOne(() => CustomerHotelDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  customerHotelDetail: CustomerHotelDetail;

  @OneToOne(() => TboHotelDetail, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tboHotelDetail: TboHotelDetail;

  @OneToOne(() => TboHotelBookResponse, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tboHotelBookResponse: TboHotelBookResponse;

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
