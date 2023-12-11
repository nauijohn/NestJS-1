import { Request } from 'express';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  Public,
  PublicAccessToken,
  PublicAuthenticated,
  PublicRefreshToken,
} from '../auth/decorators/is-public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { FacebookGuard } from '../auth/guards/facebook.guard';
import { MyLoggerService } from '../utils/my-logger.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('test')
@ApiTags('test')
export class TestController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly httpService: HttpService,
  ) {}

  @Get('user')
  @Roles(Role.User)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    status: 200,
    description: 'test route for user role',
    type: 'object',
  })
  accessUserRole(@Req() req: RequestWithUser) {
    this.loggerService.log('accessUserRole...');
    this.loggerService.debug('req.isAuthenticated: ', req.isAuthenticated());
    this.loggerService.debug(`req.user: `, req.user);
    return 'accessed user role';
  }

  @Get('admin')
  @Roles(Role.Admin)
  @ApiBearerAuth('JWT-auth')
  accessAdminRole() {
    this.loggerService.log('accessAdminRole...');
    return 'accessed admin role';
  }

  @Get('public')
  @PublicAccessToken()
  @PublicRefreshToken()
  @PublicAuthenticated()
  accessPublic() {
    this.loggerService.log('accessPublic...');
    const testDate = '1992-11-18';
    const x = moment(testDate).format('YYYY-MM-DDTHH:mm:SS');
    console.log('x: ', x);
    return 'accessed public';
  }

  @Get('test')
  test() {
    const observable = new Observable((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      setTimeout(() => {
        subscriber.next(4);
        subscriber.complete();
      }, 1000);
    });
    console.log('just before subscribe');
    const observer = observable.subscribe({
      next(x) {
        console.log('got value ' + x);
      },
      error(err) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        console.log('done');
      },
    });
    observer.unsubscribe();
    console.log('just after subscribe');
    this.loggerService.log(`observable: ${JSON.stringify(observable)}`);
    return 'test';
  }

  @Get('/facebook')
  @PublicAccessToken()
  @PublicRefreshToken()
  @PublicAuthenticated()
  @UseGuards(FacebookGuard)
  async facebookTest() {
    return 'test';
  }

  @Post()
  @Public()
  async test1(@Body() test: any) {
    this.loggerService.log('test1...');

    console.log('test: ', test);
    console.log('test.data.attributes.data: ', test.data.attributes.data);
    return 'test';
  }

  @Get()
  @Public()
  async test2() {
    this.loggerService.log('test2...');

    return 'test';
  }
}
