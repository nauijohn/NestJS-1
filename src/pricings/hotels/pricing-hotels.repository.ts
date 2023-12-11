import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PricingHotel } from './pricing-hotel.entity';

@Injectable()
export class PricingHotelsRepository
  implements GenericRepository<PricingHotel>
{
  constructor(
    @InjectRepository(PricingHotel)
    private readonly repository: Repository<PricingHotel>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: PricingHotel): Promise<PricingHotel> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<PricingHotel[]> {
    return await this.repository.find();
  }

  async fetchById(id: number): Promise<PricingHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(item: PricingHotel): Promise<PricingHotel> {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }
}
