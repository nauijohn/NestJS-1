import { AutoMap } from '@automapper/classes';

export class CreateTransactionHotelRequestDto {
  @AutoMap()
  location: string;

  @AutoMap()
  adults: number;

  @AutoMap()
  rooms: number;

  @AutoMap()
  checkInDate: Date;

  @AutoMap()
  checkOutDate: Date;
}
