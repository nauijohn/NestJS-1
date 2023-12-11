import { Model, now, Types } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../../utils/my-logger.service';
import { LocalUserDto } from './dtos/local-user.dto';
import { CreateLocalUserRequestDto } from './dtos/request/create-user-request.dto';
import { LocalUser } from './local-user.schema';

@Injectable()
export class LocalUsersRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(LocalUser.name)
    private readonly localUserModel: Model<LocalUser>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createLocalUserRequestDto: CreateLocalUserRequestDto) {
    this.loggerService.log('create...');
    const document = await this.localUserModel.create(
      createLocalUserRequestDto,
    );
    return document
      ? this.classMapper.map(document, LocalUser, LocalUserDto)
      : null;
  }

  async findByEmail(email: string) {
    this.loggerService.log('findByEmail...');
    const document = await this.localUserModel
      .findOne({ email })
      .select(['-__v', '-password']);
    return document
      ? this.classMapper.map(document, LocalUser, LocalUserDto)
      : null;
  }

  async findWithPasswordByEmail(email: string) {
    this.loggerService.log('findWithPasswordByEmail...');
    const document = await this.localUserModel
      .findOne({ email })
      .select(['-__v'])
      .populate('roles');
    return document
      ? this.classMapper.map(document, LocalUser, LocalUserDto)
      : null;
  }

  async findById(id: string) {
    this.loggerService.log('findById...');
    const mongodId = new Types.ObjectId(id);
    const document = await this.localUserModel
      .findById(mongodId)
      .select(['-v', '-password'])
      .populate('roles');
    return document
      ? this.classMapper.map(document, LocalUser, LocalUserDto)
      : null;
  }

  async updatePassword(userId: string, newPassword: string) {
    this.loggerService.log('updatePassword...');

    const mongodId = new Types.ObjectId(userId);

    const { modifiedCount } = await this.localUserModel.updateOne(
      {
        _id: mongodId,
      },
      { $set: { password: newPassword, passwordUpdatedAt: now() } },
    );
    return modifiedCount === 1 ? true : false;
  }

  async fetchByIdWithRoles(id: string) {
    this.loggerService.log('fetchUserByIdWithRoles...');
    const mongodId = new Types.ObjectId(id);
    const document = await this.localUserModel
      .findById(mongodId)
      .select(['-v', '-password'])
      .populate('roles');
    return document
      ? this.classMapper.map(document, LocalUser, LocalUserDto)
      : null;
  }

  async updateUserRole(userId: string, userRoleId: string) {
    this.loggerService.log('updateUserRole...');
    const mongodId = new Types.ObjectId(userId);
    const { modifiedCount } = await this.localUserModel.updateOne(
      { _id: mongodId },
      { $push: { roles: userRoleId } },
    );
    return modifiedCount === 1 ? true : false;
  }

  async fetchPasswordById(id: string) {
    this.loggerService.log('fetchPasswordById...');
    const mongodId = new Types.ObjectId(id);
    const document = await this.localUserModel
      .findById(mongodId)
      .select(['password'])
      .populate('roles');
    return document
      ? this.classMapper.map(document, LocalUser, LocalUserDto)
      : null;
  }
}
