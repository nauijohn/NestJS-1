import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PrebookingFlight } from '../../../prebookings/prebooking-flights/prebooking-flight.entity';
import {
  MystiflyRevalidationExtraServices,
  MystiflyRevalidationPricedItineraries,
} from '../flight-utils/dtos/response/mystifly-revalidation-response.dto';

@Entity({ name: 'mystifly_flight_revalidation_responses' })
export class MystiflyFlightRevalidationResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'json' })
  pricedItineraries: MystiflyRevalidationPricedItineraries[];

  @Column()
  conversationId: string;

  @Column({ type: 'json' })
  errors: any[];

  @Column({ type: 'json' })
  extraServices: MystiflyRevalidationExtraServices[];

  @Column()
  traceId: string;

  @Column()
  isValidReason: string;

  @Column()
  providerReference: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @ManyToOne(
    () => PrebookingFlight,
    (prebookingFlight) => prebookingFlight.mystiflyFlightRevalidationResponses,
    {
      eager: false,
      cascade: false,
      onDelete: 'CASCADE',
    },
  )
  prebookingFlight: PrebookingFlight;

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
