import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerHotelDetail } from './customer-hotel-detail.entity';

@Injectable()
export class CustomerHotelDetailsRepository
  implements GenericRepository<CustomerHotelDetail>
{
  constructor(
    private readonly loggerService: MyLoggerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectRepository(CustomerHotelDetail)
    private readonly repository: Repository<CustomerHotelDetail>,
  ) {}

  async create(item: CustomerHotelDetail): Promise<CustomerHotelDetail> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<CustomerHotelDetail[]> {
    this.loggerService.log('fetchAll...');
    return await this.repository.findBy({
      userId: this.request.user?.id ?? null,
    });
  }

  async fetchById(id: number): Promise<CustomerHotelDetail> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(item: CustomerHotelDetail): Promise<CustomerHotelDetail> {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByAllDetails(
    item: CustomerHotelDetail,
  ): Promise<CustomerHotelDetail> {
    this.loggerService.log('fetchByAllDetails...');
    const { email, name, mobileNumber } = item;
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      email,
      name,
      mobileNumber,
    });
  }
}
