import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';

import { TboHotelPrebookResponse } from '../../providers/tbo/hotel-prebook-responses/tbo-hotel-prebook-response.entity';
import { HotelProvider } from './hotel-provider.enum';

@Entity({ name: 'prebooking_hotels' })
export class PrebookingHotel {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  @AutoMap()
  provider: HotelProvider;

  @Column()
  providerReference: string;

  @OneToMany(
    () => TboHotelPrebookResponse,
    (tboHotelPrebookResponse) => tboHotelPrebookResponse.prebookingHotel,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  tboHotelPrebookResponses: TboHotelPrebookResponse[];

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
