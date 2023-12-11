import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../utils/my-logger.service';
import { UsersService } from './users.service';

@Controller()
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Get('get-details')
  async getDetails() {
    this.loggerService.log('getDetails...');

    const data = await this.usersService.getDetails();

    return { statusCode: 200, data };
  }
}
