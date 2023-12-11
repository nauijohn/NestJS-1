import { Model, Types } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTravelerDetailRequestDto } from './dtos/request/create-traveler-details-request.dto';
import { UpdateTravelerDetailRequestDto } from './dtos/request/update-traveler-details-request.dto';
import { TravelerDetailDto } from './dtos/traveler-detail.dto';
import { TravelerDetail } from './traveler-detail.schema';

@Injectable()
export class TravelerDetailsRepository {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(TravelerDetail.name)
    private readonly travelerDetailModel: Model<TravelerDetail>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(
    createTravelerDetailsRequestDto: CreateTravelerDetailRequestDto[],
  ) {
    this.loggerService.log('create...');
    const document = await this.travelerDetailModel.create(
      createTravelerDetailsRequestDto,
    );
    return document
      ? this.classMapper.mapArray(document, TravelerDetail, TravelerDetailDto)
      : null;
  }

  async fetchAllUserTravelerDetails() {
    this.loggerService.log('fetchAllUserTravelerDetails...');
    const document = await this.travelerDetailModel.find({
      user: this.request.user.id,
    });
    return document
      ? this.classMapper.mapArray(document, TravelerDetail, TravelerDetailDto)
      : null;
  }

  async fetchUserTravelerDetailById(id: string) {
    this.loggerService.log('fetchUserTravelerDetailById...');
    const mongodId = new Types.ObjectId(id);
    const document = await this.travelerDetailModel.findOne({
      _id: mongodId,
      user: this.request.user.id,
    });
    return document
      ? this.classMapper.map(document, TravelerDetail, TravelerDetailDto)
      : null;
  }

  async update(
    updateTravelerDetailsRequestDto: UpdateTravelerDetailRequestDto,
  ) {
    this.loggerService.log('update...');
    const mongodId = new Types.ObjectId(updateTravelerDetailsRequestDto.id);
    delete updateTravelerDetailsRequestDto.id;
    const { modifiedCount } = await this.travelerDetailModel.updateOne(
      { _id: mongodId },
      updateTravelerDetailsRequestDto,
    );
    return modifiedCount === 1 ? true : false;
  }

  async deleteUserTravelerDetailById(id: string) {
    this.loggerService.log('deleteUserTravelerDetailById...');
    const mongodId = new Types.ObjectId(id);
    const { deletedCount } = await this.travelerDetailModel.deleteOne({
      _id: mongodId,
      user: this.request.user.id,
    });
    return deletedCount === 1 ? true : false;
  }
}
