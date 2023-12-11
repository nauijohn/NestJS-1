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
  MystiflyFareRulesBaggageInfos,
  MystiflyFareRulesFareRules,
} from '../flight-utils/dtos/response/mystifly-fare-rules-response.dto';

@Entity({ name: 'mystifly_flight_fare_rules_responses' })
export class MystiflyFlightFareRulesResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'json' })
  baggageInfos: MystiflyFareRulesBaggageInfos;

  @Column()
  conversationId: string;

  @Column({ type: 'json' })
  errors: any[];

  @Column({ type: 'json' })
  fareRules: MystiflyFareRulesFareRules;

  @Column({ type: 'json' })
  traceId: string;

  @Column()
  providerReference: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

  @ManyToOne(
    () => PrebookingFlight,
    (prebookingFlight) => prebookingFlight.mystiflyFlightFareRulesResponses,
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
