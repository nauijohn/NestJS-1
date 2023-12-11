import { v4 as uuidv4 } from 'uuid';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTransactionFlightRequestDto } from './dtos/request/create-transaction-flight-request.dto';
import { UpdateTransactionFlightRequestDto } from './dtos/request/update-transaction-flight-request.dto';
import { TransactionFlight } from './transaction-flight.entity';
import { TransactionFlightsRepository } from './transaction-flights.repository';

@Injectable()
export class TransactionFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionFlightsRepository: TransactionFlightsRepository,
  ) {}

  async create(
    createTransactionFlightRequestDto: CreateTransactionFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    const transactionFlight = this.classMapper.map(
      createTransactionFlightRequestDto,
      CreateTransactionFlightRequestDto,
      TransactionFlight,
    );
    transactionFlight.userId = this.request.user?.id ?? null;
    transactionFlight.transactionId = `GLGFMY${new Date().getTime()}`;
    transactionFlight.flightReference = uuidv4();

    this.loggerService.debug('transactionFlight: ', transactionFlight);

    return await this.transactionFlightsRepository.create(transactionFlight);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.transactionFlightsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const transactionHotel = await this.transactionFlightsRepository.fetchById(
      id,
    );
    if (!transactionHotel)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: id not found',
      );

    return transactionHotel;
  }

  async fetchByPaymentReferenceNumber(paymentReferenceNumber: string) {
    this.loggerService.log('fetchByPaymentReferenceNumber...');

    const transactionHotel =
      await this.transactionFlightsRepository.fetchByPaymentReferenceNumber(
        paymentReferenceNumber,
      );
    if (!transactionHotel)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentReferenceNumber not found',
      );

    return transactionHotel;
  }

  async fetchByPaymentIntentId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentId...');

    const transactionHotel =
      await this.transactionFlightsRepository.fetchByPaymentIntentId(
        paymentIntentId,
      );
    if (!transactionHotel)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentIntentId not found',
      );

    return transactionHotel;
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');

    const transactionHotel =
      await this.transactionFlightsRepository.fetchByPaymentIntentIdWithoutUserId(
        paymentIntentId,
      );
    if (!transactionHotel)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentIntentId not found',
      );

    return transactionHotel;
  }

  async update(
    updateTransactionFlightRequestDto: UpdateTransactionFlightRequestDto,
  ) {
    this.loggerService.log('update...');

    const transactionFlightDB =
      await this.transactionFlightsRepository.fetchById(
        updateTransactionFlightRequestDto.id,
      );
    if (!transactionFlightDB)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: id not found',
      );

    const transactionFlight = this.classMapper.map(
      updateTransactionFlightRequestDto,
      UpdateTransactionFlightRequestDto,
      TransactionFlight,
    );

    console.log('transactionFlight: ', transactionFlight);

    return await this.transactionFlightsRepository.update(transactionFlight);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const transactionHotelDB =
      await this.transactionFlightsRepository.fetchById(id);
    if (!transactionHotelDB)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: id not found',
      );

    const isSuccess = await this.transactionFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByTransactionId(transactionId: string) {
    this.loggerService.log('fetchByTransactionId...');

    this.loggerService.debug('transactionId: ', transactionId);

    const transactionHotel =
      await this.transactionFlightsRepository.fetchByTransactionId(
        transactionId,
      );
    this.loggerService.debug('transactionHotel: ', transactionHotel);
    if (!transactionHotel)
      this.errorHandlerService.notFoundException('Id not found');
    return transactionHotel;
  }

  async updateBookingHotel(transactionFlight: TransactionFlight) {
    this.loggerService.log('updateBookingHotel...');

    return await this.transactionFlightsRepository.update(transactionFlight);
  }
}
