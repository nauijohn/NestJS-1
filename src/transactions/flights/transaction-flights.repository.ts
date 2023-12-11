import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { TransactionFlight } from './transaction-flight.entity';

@Injectable()
export class TransactionFlightsRepository
  implements GenericRepository<TransactionFlight>
{
  constructor(
    @InjectRepository(TransactionFlight)
    private readonly repository: Repository<TransactionFlight>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: TransactionFlight): Promise<TransactionFlight> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<TransactionFlight[]> {
    this.loggerService.log('fetchAll...');
    return await this.repository.find({
      where: { userId: this.request.user?.id ?? null },
      relations: {
        prebookingFlight: true,
        bookingFlights: true,
      },
    });
  }

  async fetchById(id: number): Promise<TransactionFlight> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      id,
    });
  }

  async update(item: TransactionFlight): Promise<TransactionFlight> {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByTransactionId(
    transactionId: string,
  ): Promise<TransactionFlight> {
    this.loggerService.log('fetchByTransactionId...');
    transactionId = transactionId ?? '';
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      transactionId,
    });
  }

  async fetchByPaymentReferenceNumber(paymentReferenceNumber: string) {
    this.loggerService.log('fetchByPaymentReferenceNumber...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      paymentFlight: {
        referenceNumber: paymentReferenceNumber,
      },
    });
  }

  async fetchByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentId...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      paymentFlight: {
        paymentIntentId,
      },
    });
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');
    return await this.repository.findOneBy({
      paymentFlight: {
        paymentIntentId,
      },
    });
  }
}
