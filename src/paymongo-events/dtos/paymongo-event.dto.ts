import { AutoMap } from '@automapper/classes';

export class PaymongoEventDto {
  @AutoMap()
  id: string;

  @AutoMap()
  eventId: string;

  @AutoMap()
  type: string;

  @AutoMap()
  data: Object;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}
