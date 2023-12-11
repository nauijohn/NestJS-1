import { Model, Types } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../../utils/my-logger.service';
import { FacebookUserDto } from './dtos/facebook-user.dto';
import { CreateFacebookUserRequestDto } from './dtos/request/create-facebook-user-request.dto';
import { FacebookUser } from './facebook-user.schema';

@Injectable()
export class FacebookUsersRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(FacebookUser.name)
    private readonly facebookUserModel: Model<FacebookUser>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createFacebookUserRequestDto: CreateFacebookUserRequestDto) {
    this.loggerService.log('create...');
    console.log('createFacebookUserRequestDto: ', createFacebookUserRequestDto);
    const document = await this.facebookUserModel.create(
      createFacebookUserRequestDto,
    );
    return document
      ? this.classMapper.map(document, FacebookUser, FacebookUserDto)
      : null;
  }

  async findById(id: string) {
    this.loggerService.log('findById...');
    const mongodId = new Types.ObjectId(id);
    const document = await this.facebookUserModel
      .findById(mongodId)
      .select(['-__v'])
      .populate('roles');
    return document
      ? this.classMapper.map(document, FacebookUser, FacebookUserDto)
      : null;
  }

  async findByFacebookId(facebookId: string) {
    this.loggerService.log('findByFacebookId...');
    const document = await this.facebookUserModel
      .findOne({ facebookId })
      .select(['-__v'])
      .populate('roles');
    this.loggerService.debug('document: ', document);
    return document
      ? this.classMapper.map(document, FacebookUser, FacebookUserDto)
      : null;
  }

  async fetchUserByIdWithRoles(id: string) {
    this.loggerService.log('fetchUserByIdWithRoles...');
    const mongodId = new Types.ObjectId(id);
    const document = await this.facebookUserModel
      .findById(mongodId)
      .select(['-__v'])
      .populate('roles');
    return document
      ? this.classMapper.map(document, FacebookUser, FacebookUserDto)
      : null;
  }

  async updateUserRole(userId: string, userRoleId: string) {
    this.loggerService.log('updateUserRole...');
    const mongodId = new Types.ObjectId(userId);
    const { modifiedCount } = await this.facebookUserModel.updateOne(
      { _id: mongodId },
      { $push: { roles: userRoleId } },
    );
    return modifiedCount === 1 ? true : false;
  }

  async findByEmail(email: string) {
    this.loggerService.log('findByEmail...');
    const document = await this.facebookUserModel
      .findOne({ email })
      .select(['-__v']);
    return document
      ? this.classMapper.map(document, FacebookUser, FacebookUserDto)
      : null;
  }
}
