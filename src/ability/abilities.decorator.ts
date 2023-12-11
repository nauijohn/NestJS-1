import { SetMetadata } from '@nestjs/common';

import { LocalUser } from '../users/local-users/local-user.schema';
import { Action, Subjects } from './ability.factory';

export interface RequiredRule {
  action: Action;
  subject: Subjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);

export class ReadUserAbility implements RequiredRule {
  action = Action.Read;
  subject = LocalUser;
}
