import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { TestController } from './test.controller';

@Module({
  imports: [UsersModule, UtilsModule, HttpModule],
  controllers: [TestController],
})
export class TestModule {}
