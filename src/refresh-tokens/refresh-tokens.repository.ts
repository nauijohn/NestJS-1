import { Model } from 'mongoose';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { MyLoggerService } from '../utils/my-logger.service';
import { CreateRefreshTokenDto } from './dtos/create-refresh-token.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { UpdateRefreshTokenDto } from './dtos/update-refresh-token.dto';
import { RefreshToken } from './refresh-token.schema';

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    this.loggerService.verbose('create...');
    const refreshTokenDocument = await this.refreshTokenModel.create(
      createRefreshTokenDto,
    );
    return refreshTokenDocument
      ? this.classMapper.map(
          refreshTokenDocument,
          RefreshToken,
          RefreshTokenDto,
        )
      : null;
  }

  async update(updateRefreshTokenDto: UpdateRefreshTokenDto) {
    this.loggerService.verbose('update...');
    const { userId, refreshToken } = updateRefreshTokenDto;
    const { modifiedCount } = await this.refreshTokenModel.updateOne(
      { userId },
      { refreshToken },
    );
    return modifiedCount === 1 ? true : false;
  }

  async findByUserId(userId: string) {
    this.loggerService.log('findByUserId...');
    const refreshTokenDocument = await this.refreshTokenModel.findOne({
      userId,
    });
    return refreshTokenDocument
      ? this.classMapper.map(
          refreshTokenDocument,
          RefreshToken,
          RefreshTokenDto,
        )
      : null;
  }
}
