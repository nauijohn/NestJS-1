import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { MystiflyFlightBookResponse } from './mystifly-flight-book-response.entity';

@Injectable()
export class MystiflyFlightBookResponsesRepository
  implements GenericRepository<MystiflyFlightBookResponse>
{
  constructor(
    @InjectRepository(MystiflyFlightBookResponse)
    private readonly repository: Repository<MystiflyFlightBookResponse>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: MystiflyFlightBookResponse) {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.repository.find({
      where: { userId: this.request.user?.id ?? null },
    });
  }

  async fetchById(id: number): Promise<MystiflyFlightBookResponse> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(item: MystiflyFlightBookResponse) {
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
