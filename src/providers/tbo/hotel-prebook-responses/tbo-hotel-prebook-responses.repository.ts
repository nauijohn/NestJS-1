import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { TboHotelPrebookResponse } from './tbo-hotel-prebook-response.entity';

@Injectable()
export class TboHotelPrebookResponsesRepository
  implements GenericRepository<TboHotelPrebookResponse>
{
  constructor(
    @InjectRepository(TboHotelPrebookResponse)
    private readonly repository: Repository<TboHotelPrebookResponse>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: TboHotelPrebookResponse) {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.repository.find({
      where: { userId: this.request.user?.id ?? null },
    });
  }

  async fetchById(id: number): Promise<TboHotelPrebookResponse> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(item: TboHotelPrebookResponse) {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }
}
