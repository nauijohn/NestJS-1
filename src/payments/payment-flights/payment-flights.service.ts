import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePaymentHotelsRequestDto } from '../payment-hotels/dtos/request/create-payment-hotels-request.dto';
import { UpdatePaymentHotelsRequestDto } from '../payment-hotels/dtos/request/update-payment-hotels-request.dto';
import { PaymentHotel } from '../payment-hotels/payment-hotel.entity';
import { PaymentStatus } from '../payment-status.enum';
import { PaymentFlightsRepository } from './payment-flights.repository';

@Injectable()
export class PaymentFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly paymentFlightsRepository: PaymentFlightsRepository,
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
    paymentHotel.userId = this.request.user?.id ?? null;
    paymentHotel.status = PaymentStatus.Pending;

    return await this.paymentFlightsRepository.create(paymentHotel);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.paymentFlightsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const paymentFlight = await this.paymentFlightsRepository.fetchById(id);
    if (!paymentFlight)
      this.errorHandlerService.notFoundException('Id not found');

    return paymentFlight;
  }

  async update(updatePaymentHotelsRequestDto: UpdatePaymentHotelsRequestDto) {
    this.loggerService.log('update...');

    const { id } = updatePaymentHotelsRequestDto;
    const paymentHotelDB = await this.paymentFlightsRepository.fetchById(id);
    if (!paymentHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const paymentHotel = this.classMapper.map(
      updatePaymentHotelsRequestDto,
      UpdatePaymentHotelsRequestDto,
      PaymentHotel,
    );

    return await this.paymentFlightsRepository.update(paymentHotel);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const hotelPayment = await this.paymentFlightsRepository.fetchById(id);
    if (!hotelPayment)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.paymentFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async findPaymentIntentById(id: string) {
    this.loggerService.log('findPaymentIntentById...');
    return await this.paymentFlightsRepository.findPaymentIntentById(id);
  }

  async updateStatusToPaidByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('updateStatusToPaidByPaymentIntentId...');
    return await this.paymentFlightsRepository.updateStatusToPaidByPaymentIntentId(
      paymentIntentId,
    );
  }

  async fetchByReferenceNumber(referenceNumber: string) {
    this.loggerService.log('fetchByReferenceNumber...');
    const paymentFlight =
      await this.paymentFlightsRepository.fetchByReferenceNumber(
        referenceNumber,
      );
    if (!paymentFlight)
      this.errorHandlerService.notFoundException(
        'PaymentFlights: referenceNumber not found!',
      );
    return paymentFlight;
  }
}
