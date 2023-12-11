import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { FacebookService } from './facebook.service';

@Controller()
@ApiTags('facebook')
export class FacebookController {
  constructor(
    private readonly facebookService: FacebookService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post()
  @Public()
  async getAccessToken(@Body('code') code: string) {
    this.loggerService.log('getAccessToken...');

    return await this.facebookService.getAccessToken(code);
  }

  @Post('decode-access-token')
  @Public()
  async decodeAccessToken(@Body('accessToken') accessToken: string) {
    this.loggerService.log('decodeAccessToken...');

    return await this.facebookService.decodeAccessToken(accessToken);
  }
}
