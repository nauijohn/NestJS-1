import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { FacebookUsersService } from './facebook-users.service';

@Controller()
@ApiTags('users')
export class FacebookUsersController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly facebookUsersService: FacebookUsersService,
  ) {}

  @Post('verify-email')
  @Public()
  async verifyEmail(@Body('email') email: string) {
    this.loggerService.log('verifyEmail...');
    const data = await this.facebookUsersService.isEmailExists(email);
    return { statusCode: HttpStatus.OK, data };
  }
}
