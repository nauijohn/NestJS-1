import { AutoMap } from '@automapper/classes';

export class FacebookUserDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email?: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  middleName?: string;

  @AutoMap()
  lastName: string;

  // @AutoMap()
  // mobileNumber: string;

  // @AutoMap()
  // birthDate: string;

  @AutoMap()
  profilePic: string;

  @AutoMap()
  roles: string[];
}
