import { Injectable } from '@nestjs/common';

import { MyLoggerService } from '../utils/my-logger.service';
import { CreateRefreshTokenDto } from './dtos/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dtos/update-refresh-token.dto';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    this.loggerService.log('create...');
    return await this.refreshTokensRepository.create(createRefreshTokenDto);
  }

  async update(updateRefreshTokenDto: UpdateRefreshTokenDto) {
    this.loggerService.log('update...');
    return await this.refreshTokensRepository.update(updateRefreshTokenDto);
  }

  async findByUserId(userId: string) {
    this.loggerService.log('findByUserId...');
    return await this.refreshTokensRepository.findByUserId(userId);
  }
}
