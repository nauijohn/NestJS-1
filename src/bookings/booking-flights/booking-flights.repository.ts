import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { BookingFlight } from './booking-flight.entity';

@Injectable()
export class BookingFlightsRepository
  implements GenericRepository<BookingFlight>
{
  constructor(
    private readonly loggerService: MyLoggerService,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    @InjectRepository(BookingFlight)
    private readonly repository: Repository<BookingFlight>,
  ) {}

  async create(item: BookingFlight): Promise<BookingFlight> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<BookingFlight[]> {
    this.loggerService.log('fetchAll...');
    return await this.repository.find({
      where: { userId: this.request.user?.id ?? null },
      relations: {
        passengerDetails: true,
        customerFlightDetail: true,
      },
    });
  }

  async fetchById(id: number): Promise<BookingFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOne({
      where: {
        userId: this.request.user?.id ?? null,
        id,
      },
      relations: {
        passengerDetails: true,
        mystiflyFlightDetail: true,
      },
    });
  }

  async update(item: BookingFlight): Promise<BookingFlight> {
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
