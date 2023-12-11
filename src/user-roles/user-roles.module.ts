import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { UserRoleMapperProfile } from './automapper/user-role-mapper.profile';
import { UserRole, UserRoleSchema } from './user-role.schema';
import { UserRolesController } from './user-roles.controller';
import { UserRolesRepository } from './user-roles.repository';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    UtilsModule,
    UsersModule,
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService, UserRolesRepository, UserRoleMapperProfile],
  exports: [UserRolesService],
})
export class UserRolesModule {}
