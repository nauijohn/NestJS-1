import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { MystiflyFlightDetail } from './mystifly-flight-detail.entity';

@Injectable()
export class MystiflyFlightDetailsRepository
  implements GenericRepository<MystiflyFlightDetail>
{
  constructor(
    @InjectRepository(MystiflyFlightDetail)
    private readonly repository: Repository<MystiflyFlightDetail>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: MystiflyFlightDetail) {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll() {
    this.loggerService.log('findAll...');
    return await this.repository.find({
      where: { userId: this.request.user?.id ?? null },
    });
  }

  async fetchById(id: number): Promise<MystiflyFlightDetail> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(item: MystiflyFlightDetail) {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByProviderReference(providerReference: string) {
    this.loggerService.log('fetchByProviderReference...');
    return await this.repository.findBy({
      userId: this.request.user?.id ?? null,
      providerReference,
    });
  }

  async fetchByPaymentReference(paymentReferenceNumber: string) {
    this.loggerService.log('fetchByPaymentReference...');
    return await this.repository.findBy({
      userId: this.request.user?.id ?? null,
      paymentReferenceNumber,
    });
  }
}
