import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { TransactionHotel } from './transaction-hotel.entity';

@Injectable()
export class TransactionHotelsRepository
  implements GenericRepository<TransactionHotel>
{
  constructor(
    @InjectRepository(TransactionHotel)
    private readonly repository: Repository<TransactionHotel>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: TransactionHotel): Promise<TransactionHotel> {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll(): Promise<TransactionHotel[]> {
    this.loggerService.log('fetchAll...');
    return await this.repository.find({
      where: { userId: this.request.user?.id ?? null },
      relations: {
        prebookingHotel: true,
        bookingHotels: true,
      },
    });
  }

  async fetchById(id: number): Promise<TransactionHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOne({
      where: {
        userId: this.request.user?.id ?? null,
        id,
      },
      relations: {
        bookingHotels: true,
        paymentHotel: true,
      },
    });
  }

  async update(item: TransactionHotel): Promise<TransactionHotel> {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number): Promise<boolean> {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async fetchByTransactionId(transactionId: string): Promise<TransactionHotel> {
    this.loggerService.log('fetchByTransactionId...');
    transactionId = transactionId ?? '';
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      transactionId,
    });
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');
    return await this.repository.findOneBy({
      paymentHotel: {
        paymentIntentId,
      },
    });
  }
}
