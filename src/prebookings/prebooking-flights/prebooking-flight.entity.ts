import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FlightProvider } from '../../bookings/booking-flights/flight-provider.enum';
import { FlightType } from '../../bookings/booking-flights/flight-type.enum';
import { MystiflyFlightFareRulesResponse } from '../../providers/mystifly/flight-fare-rules-responses/mystifly-flight-fare-rules-response.entity';
import { MystiflyFlightRevalidationResponse } from '../../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-response.entity';

@Entity({ name: 'prebooking_flights' })
export class PrebookingFlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  flightType: FlightType;

  @Column()
  provider: FlightProvider;

  @Column()
  providerReference: string;

  @OneToMany(
    () => MystiflyFlightFareRulesResponse,
    (mystiflyFlightFareRulesResponses) =>
      mystiflyFlightFareRulesResponses.prebookingFlight,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  mystiflyFlightFareRulesResponses: MystiflyFlightFareRulesResponse[];

  @OneToMany(
    () => MystiflyFlightRevalidationResponse,
    (mystiflyFlightRevalidationResponses) =>
      mystiflyFlightRevalidationResponses.prebookingFlight,
    {
      eager: true,
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  mystiflyFlightRevalidationResponses: MystiflyFlightRevalidationResponse[];

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
