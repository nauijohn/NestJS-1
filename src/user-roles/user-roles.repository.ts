import { Model, Types } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../utils/my-logger.service';
import { CreateUserRoleRequestDto } from './dtos/request/create-user-role-request.dto';
import { UserRoleDto } from './dtos/user-role.dto';
import { UserRole } from './user-role.schema';

@Injectable()
export class UserRolesRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createUserRoleRequestDto: CreateUserRoleRequestDto) {
    this.loggerService.log('create...');
    this.loggerService.debug(
      'createUserRoleRequestDto: ',
      createUserRoleRequestDto,
    );
    const { userId, role, signAs } = createUserRoleRequestDto;
    const document = await this.userRoleModel.create({
      user: userId,
      role,
      signAs,
    });
    this.loggerService.debug('document: ', document);
    return document
      ? this.classMapper.map(document, UserRole, UserRoleDto)
      : null;
  }

  async findUserRoleByUserId(userId: string) {
    this.loggerService.log('findUserRoleByUserId...');
    const document = await this.userRoleModel
      .findOne({ user: userId })
      .select(['role']);
    return document
      ? this.classMapper.map(document, UserRole, UserRoleDto)
      : null;
  }

  async fetchUserRoleById(id: string) {
    const mongodId = new Types.ObjectId(id);
    const document = await this.userRoleModel
      .findById(mongodId)
      .populate('user');
    return document
      ? this.classMapper.map(document, UserRole, UserRoleDto)
      : null;
  }
}
