import { AutoMap } from '@automapper/classes';

export class UserRoleDto {
  @AutoMap()
  id: string;

  @AutoMap()
  signAs: string;

  @AutoMap()
  userId: string;

  @AutoMap()
  role: string;

  @AutoMap()
  createdAt?: Date;

  @AutoMap()
  updatedAt?: Date;
}
