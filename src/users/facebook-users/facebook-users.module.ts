import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsModule } from '../../utils/utils.module';
import { FacebookUserMapperProfile } from './automapper/facebook-user-mapper.profile';
import { FacebookUser, FacebookUserSchema } from './facebook-user.schema';
import { FacebookUsersController } from './facebook-users.controller';
import { FacebookUsersRepository } from './facebook-users.repository';
import { FacebookUsersService } from './facebook-users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FacebookUser.name, schema: FacebookUserSchema },
    ]),
    UtilsModule,
  ],
  controllers: [FacebookUsersController],
  providers: [
    FacebookUsersService,
    FacebookUsersRepository,
    FacebookUserMapperProfile,
  ],
  exports: [FacebookUsersService],
})
export class FacebookUsersModule {}
