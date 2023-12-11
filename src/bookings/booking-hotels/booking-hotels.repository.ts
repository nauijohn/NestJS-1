import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingHotel } from './booking-hotel.entity';

@Injectable()
export class BookingHotelsRepository
  implements GenericRepository<BookingHotel>
{
  constructor(
    private readonly loggerService: MyLoggerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectRepository(BookingHotel)
    private readonly repository: Repository<BookingHotel>,
  ) {}

  async create(item: BookingHotel): Promise<BookingHotel> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<BookingHotel[]> {
    this.loggerService.log('fetchAll...');
    return await this.repository.findBy({ userId: this.request.user.id });
  }

  async fetchById(id: number): Promise<BookingHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOne({
      where: {
        userId: this.request.user.id,
        id,
      },
      relations: {
        tboHotelDetail: true,
      },
    });
  }

  async update(item: BookingHotel): Promise<BookingHotel> {
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
