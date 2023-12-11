import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { PaymentStatus } from '../payment-status.enum';
import { CreatePaymentHotelsRequestDto } from './dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from './dtos/request/update-payment-hotels-request.dto';
import { PaymentHotel } from './payment-hotel.entity';
import { PaymentHotelsRepository } from './payment-hotels.repository';

@Injectable()
export class PaymentHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly paymentHotelsRepository: PaymentHotelsRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createPaymentHotelsRequestDto: CreatePaymentHotelsRequestDto) {
    this.loggerService.log('create...');

    const paymentHotel = this.classMapper.map(
      createPaymentHotelsRequestDto,
      CreatePaymentHotelsRequestDto,
      PaymentHotel,
    );
    paymentHotel.userId = this.request.user.id;
    paymentHotel.status = PaymentStatus.Pending;

    return await this.paymentHotelsRepository.create(paymentHotel);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.paymentHotelsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const paymentHotel = await this.paymentHotelsRepository.fetchById(id);
    if (!paymentHotel)
      this.errorHandlerService.notFoundException('Id not found');

    return paymentHotel;
  }

  async update(updatePaymentHotelsRequestDto: UpdatePaymentHotelsRequestDto) {
    this.loggerService.log('update...');

    const { id } = updatePaymentHotelsRequestDto;
    const paymentHotelDB = await this.paymentHotelsRepository.fetchById(id);
    if (!paymentHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const paymentHotel = this.classMapper.map(
      updatePaymentHotelsRequestDto,
      UpdatePaymentHotelsRequestDto,
      PaymentHotel,
    );

    return await this.paymentHotelsRepository.update(paymentHotel);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const hotelPayment = await this.paymentHotelsRepository.fetchById(id);
    if (!hotelPayment)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.paymentHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async findPaymentIntentById(id: string) {
    this.loggerService.log('findPaymentIntentById...');
    return await this.paymentHotelsRepository.findPaymentIntentById(id);
  }

  async updateStatusToPaidByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');
    return await this.paymentHotelsRepository.updateStatusToPaidByPaymentIntentId(
      paymentIntentId,
    );
  }

  async fetchByReferenceNumber(referenceNumber: string) {
    this.loggerService.log('fetchByReferenceNumber...');
    const paymentHotel =
      await this.paymentHotelsRepository.fetchByReferenceNumber(
        referenceNumber,
      );
    if (!paymentHotel)
      this.errorHandlerService.notFoundException(
        'PaymentHotels: referenceNumber not found!',
      );
    return paymentHotel;
  }
}
