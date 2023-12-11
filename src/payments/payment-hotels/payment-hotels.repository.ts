import { Repository } from 'typeorm';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { GenericRepository } from '../../common/abstracts/generic-repository.abstract';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PaymentStatus } from '../payment-status.enum';
import { PaymentHotel } from './payment-hotel.entity';

@Injectable()
export class PaymentHotelsRepository
  implements GenericRepository<PaymentHotel>
{
  constructor(
    @InjectRepository(PaymentHotel)
    private readonly repository: Repository<PaymentHotel>,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
  ) {}

  async create(item: PaymentHotel) {
    this.loggerService.log('create...');
    return await this.repository.save(item);
  }

  async fetchAll() {
    this.loggerService.log('findAll...');
    return await this.repository.find({
      where: { userId: this.request.user.id },
    });
  }

  async fetchById(id: number): Promise<PaymentHotel> {
    this.loggerService.log('fetchById...');
    return await this.repository.findOneBy({
      userId: this.request.user.id,
      id,
    });
  }

  async update(item: PaymentHotel) {
    this.loggerService.log('update...');
    return await this.repository.save(item);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    const { affected } = await this.repository.delete(id);
    if (affected === 1) return true;
    return false;
  }

  async findPaymentIntentById(paymentIntentId: string) {
    this.loggerService.log('findPaymentIntentById...');
    paymentIntentId = paymentIntentId ?? '';
    return await this.repository.findOneBy({
      paymentIntentId,
    });
  }

  async updateStatusToPaidByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');
    const { affected } = await this.repository.update(
      { paymentIntentId },
      {
        status: PaymentStatus.Paid,
      },
    );
    if (affected === 1) return true;
    return false;
  }

  async fetchByReferenceNumber(referenceNumber: string) {
    this.loggerService.log('fetchByReferenceNumber...');
    return await this.repository.findOneBy({
      userId: this.request.user?.id ?? null,
      referenceNumber,
    });
  }
}
