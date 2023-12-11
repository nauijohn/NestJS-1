import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { TboRooms } from '../hotel-utils/hotels/dtos/response/tbo-search-hotels-response.dto';

@Entity({ name: 'tbo_hotel_details' })
export class TboHotelDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  hotelCode: string;

  @Column()
  @AutoMap()
  currency: string;

  @Column({ type: 'json' })
  @AutoMap(() => [TboRooms])
  rooms: TboRooms[];

  @Column()
  @AutoMap()
  hotelName: string;

  @Column()
  @AutoMap()
  description: string;

  @Column({ type: 'json' })
  @AutoMap(() => Array<string>)
  hotelFacilities: string[];

  @Column({ type: 'json' })
  @AutoMap(() => Object)
  attractions: Object;

  @Column({ type: 'json' })
  @AutoMap(() => Array<string>)
  images: string[];

  @Column()
  @AutoMap()
  address: string;

  @Column()
  @AutoMap()
  pinCode: string;

  @Column()
  @AutoMap()
  cityId: string;

  @Column()
  @AutoMap()
  countryName: string;

  @Column()
  @AutoMap()
  phoneNumber: string;

  @Column()
  @AutoMap()
  faxNumber: string;

  @Column()
  @AutoMap()
  map: string;

  @Column()
  @AutoMap()
  hotelRating: number;

  @Column()
  @AutoMap()
  cityName: string;

  @Column()
  @AutoMap()
  countryCode: string;

  @Column()
  @AutoMap()
  checkInTime: string;

  @Column()
  @AutoMap()
  checkOutTime: string;

  @Column({ nullable: true })
  providerReference: string;

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
