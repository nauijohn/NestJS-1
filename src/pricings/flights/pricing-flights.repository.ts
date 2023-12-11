import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { IataCode } from '../../iataCodes/iata-code.entity';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PricingFlight } from './pricing-flight.entity';

@Injectable()
export class PricingFlightsRepository
  implements GenericRepository<PricingFlight>
{
  constructor(
    @InjectRepository(PricingFlight)
    private readonly repository: Repository<PricingFlight>,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: PricingFlight): Promise<PricingFlight> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<PricingFlight[]> {
    return await this.repository.find();
  }

  async fetchById(id: number): Promise<PricingFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({ id });
  }

  async update(item: PricingFlight): Promise<PricingFlight> {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByIataCode(iataCode: IataCode): Promise<PricingFlight[]> {
    this.loggerService.log('fetchByIataCode...');
    return await this.repository.findBy({ iataCode });
  }
}
