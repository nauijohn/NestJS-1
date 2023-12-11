import { AutoMap } from '@automapper/classes';

import { FacebookUser } from '../../../users/facebook-users/facebook-user.schema';
import { LocalUser } from '../../../users/local-users/local-user.schema';

export class TravelerDetailDto {
  @AutoMap()
  id?: string;

  @AutoMap()
  signAs: string;

  @AutoMap()
  user: LocalUser | FacebookUser;

  @AutoMap()
  firstName: string;

  @AutoMap()
  middleName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  nationality: string;

  @AutoMap()
  birthDate: string;

  // @AutoMap()
  // gender: string;
  @AutoMap()
  title: string;

  @AutoMap()
  passportNumber?: string;

  @AutoMap()
  expirationDate?: string;

  @AutoMap()
  countryIssued?: string;

  @AutoMap()
  email: string;

  @AutoMap()
  mobileNumber?: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
