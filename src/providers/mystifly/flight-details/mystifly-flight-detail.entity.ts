import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  FlightFares,
  OriginDestinations,
  PenaltiesInfo,
} from '../flight-utils/dtos/response/mystifly-search-response.dto';

@Entity({ name: 'mystifly_flight_details' })
export class MystiflyFlightDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column()
  fareSourceCode: string;

  @Column()
  validatingCarrier: string;

  @Column({ type: 'json' })
  originDestinations: OriginDestinations[];

  @Column({ type: 'json' })
  flightFares: FlightFares;

  @Column({ type: 'json' })
  penaltiesInfo: PenaltiesInfo;

  @Column()
  providerReference: string;

  @Column()
  paymentReferenceNumber: string;

  @Column({ type: 'int', nullable: true })
  sequence: number;

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
