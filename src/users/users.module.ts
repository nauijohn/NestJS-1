import { Module } from '@nestjs/common';

import { UtilsModule } from '../utils/utils.module';
import { FacebookUsersModule } from './facebook-users/facebook-users.module';
import { LocalUsersModule } from './local-users/local-users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UtilsModule, LocalUsersModule, FacebookUsersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [LocalUsersModule, FacebookUsersModule],
})
export class UsersModule {}
