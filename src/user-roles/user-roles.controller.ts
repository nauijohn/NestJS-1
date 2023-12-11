import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

import { MyLoggerService } from '../utils/my-logger.service';
import { CreateUserRoleRequestDto } from './dtos/request/create-user-role-request.dto';
import { UserRolesService } from './user-roles.service';

@Controller('user-roles')
@ApiExcludeController()
export class UserRolesController {
  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post()
  async create(@Body() createUserRoleRequestDto: CreateUserRoleRequestDto) {
    this.loggerService.log('create...');
    return await this.userRolesService.create(createUserRoleRequestDto);
  }

  @Get(':id')
  async fetchUserRoleById(@Param('id') id: string) {
    this.loggerService.log('fetchUserRoleById...');
    return await this.userRolesService.fetchUserRoleById(id);
  }
}
