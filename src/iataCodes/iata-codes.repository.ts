import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../common/abstracts/generic-repository.abstract';
import { CabinClass } from '../pricings/flights/cabin-class.enum';
import { MyLoggerService } from '../utils/my-logger.service';
import { IataCode } from './iata-code.entity';

@Injectable()
export class IataCodesRepository implements GenericRepository<IataCode> {
  constructor(
    @InjectRepository(IataCode)
    private readonly repository: Repository<IataCode>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: IataCode): Promise<IataCode> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<IataCode[]> {
    return await this.repository.find();
  }

  async fetchById(id: number): Promise<IataCode> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(item: IataCode): Promise<IataCode> {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByIdAndCabinClass(id: number, cabinClass: CabinClass) {
    this.loggerService.log('fetchByIdAndCabinClass...');

    return await this.repository.findOneBy({
      id,
      pricingFlights: { cabinClass },
    });
  }
}
