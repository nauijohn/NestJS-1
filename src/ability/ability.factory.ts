import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { LocalUser } from '../users/local-users/local-user.schema';

// import { User } from '../users/user.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// class User {
//   id: string;
//   email: string;
//   roles: string[];
// }

export type Subjects = InferSubjects<typeof LocalUser> | 'all';

export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbility(user: LocalUser) {
    const { can, cannot, build } = new AbilityBuilder(
      PureAbility as AbilityClass<AppAbility>,
    );
    const userRoles = user.roles.map((userRole) => userRole.role);

    // if (userRoles.includes('User')) cannot(Action.Read, User);

    if (userRoles.includes('Admin')) {
      can(Action.Manage, 'all');
    } else {
      cannot(Action.Read, LocalUser);
      cannot(Action.Create, LocalUser).because('your special message: only admins!');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
