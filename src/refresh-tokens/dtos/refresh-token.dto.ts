import { AutoMap } from '@automapper/classes';

export class RefreshTokenDto {
  @AutoMap()
  id?: string;

  @AutoMap()
  userId: string;

  @AutoMap()
  signAs: string;

  @AutoMap()
  refreshToken: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;
}
