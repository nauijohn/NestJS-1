import { AutoMap } from '@automapper/classes';

// import { Date } from 'mongoose';

export class LocalUserDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  password: string;

  @AutoMap()
  passwordUpdatedAt: Date;

  @AutoMap()
  firstName: string;

  @AutoMap()
  middleName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  mobileNumber: string;

  @AutoMap()
  birthDate: string;

  @AutoMap()
  roles: string[];
}
