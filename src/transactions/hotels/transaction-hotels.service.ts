import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateTransactionHotelRequestDto } from './dtos/request/create-transaction-hotel-request.dto';
import { UpdateTransactionHotelRequestDto } from './dtos/request/update-transaction-hotel-request.dto';
import { TransactionHotel } from './transaction-hotel.entity';
import { TransactionHotelsRepository } from './transaction-hotels.repository';

@Injectable()
export class TransactionHotelsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly transactionHotelsRepository: TransactionHotelsRepository,
  ) {}

  async create(
    createTransactionHotelRequestDto: CreateTransactionHotelRequestDto,
  ) {
    this.loggerService.log('create...');

    const transactionHotel = this.classMapper.map(
      createTransactionHotelRequestDto,
      CreateTransactionHotelRequestDto,
      TransactionHotel,
    );
    transactionHotel.transactionId = `GLGHTB${new Date().getTime()}`;
    transactionHotel.userId = this.request.user.id ?? null;
    this.loggerService.debug('transactionHotel: ', transactionHotel);

    return await this.transactionHotelsRepository.create(transactionHotel);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.transactionHotelsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');
    return (
      (await this.transactionHotelsRepository.fetchById(id)) ??
      this.errorHandlerService.notFoundException(
        'TransactionHotel: Id not found',
      )
    );
  }

  async fetchByPaymentIntentIdWithoutUserId(paymentIntentId: string) {
    this.loggerService.log('fetchByPaymentIntentIdWithoutUserId...');

    const transactionHotel =
      await this.transactionHotelsRepository.fetchByPaymentIntentIdWithoutUserId(
        paymentIntentId,
      );
    if (!transactionHotel)
      this.errorHandlerService.notFoundException(
        'TransactionFlights: paymentIntentId not found',
      );

    return transactionHotel;
  }

  async update(
    updateTransactionHotelRequestDto: UpdateTransactionHotelRequestDto,
  ) {
    this.loggerService.log('update...');
    const { id } = updateTransactionHotelRequestDto;
    if (!(await this.transactionHotelsRepository.fetchById(id)))
      this.errorHandlerService.notFoundException(
        'TransactionHotel: Id not found',
      );
    return await this.transactionHotelsRepository.update(
      this.classMapper.map(
        updateTransactionHotelRequestDto,
        UpdateTransactionHotelRequestDto,
        TransactionHotel,
      ),
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');
    if (!(await this.transactionHotelsRepository.fetchById(id)))
      this.errorHandlerService.notFoundException(
        'TransactionHotel: Id not found',
      );
    return (await this.transactionHotelsRepository.deleteById(id))
      ? 'Delete successful!'
      : this.errorHandlerService.internalServerErrorException('Delete failed!');
  }

  async fetchByTransactionId(transactionId: string) {
    this.loggerService.log('fetchByTransactionId...');

    const transactionHotel =
      await this.transactionHotelsRepository.fetchByTransactionId(
        transactionId,
      );
    if (!transactionHotel)
      this.errorHandlerService.notFoundException(
        'TransactionHotel: Id not found',
      );
    return transactionHotel;
  }

  async updateBookingHotel(transactionHotel: TransactionHotel) {
    this.loggerService.log('updateBookingHotel...');
    return await this.transactionHotelsRepository.update(transactionHotel);
  }
}
