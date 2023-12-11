import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AbilityModule } from '../../ability/ability.module';
import { AwsModule } from '../../aws/aws.module';
import { UtilsModule } from '../../utils/utils.module';
import { LocalUserMapperProfile } from './automapper/local-user-mapper.profile';
import { LocalUser, LocalUserSchema } from './local-user.schema';
import { LocalUsersController } from './local-users.controller';
import { LocalUsersRepository } from './local-users.repository';
import { LocalUsersService } from './local-users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LocalUser.name, schema: LocalUserSchema },
    ]),
    UtilsModule,
    AbilityModule,
    AwsModule,
  ],
  controllers: [LocalUsersController],
  providers: [LocalUsersService, LocalUsersRepository, LocalUserMapperProfile],
  exports: [LocalUsersService],
})
export class LocalUsersModule {}
