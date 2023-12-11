import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerHotelDetail } from './customer-hotel-detail.entity';
import { CustomerHotelDetailsRepository } from './customer-hotel-details.repository';
import { CreateCustomerHotelDetailRequestDto } from './dtos/request/create-customer-hotel-detail-request.dto';
import { UpdateCustomerHotelDetailRequestDto } from './dtos/request/update-customer-hotel-detail-request.dto';

@Injectable()
export class CustomerHotelDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly customerHotelDetailsRepository: CustomerHotelDetailsRepository,
  ) {}

  async create(
    createCustomerHotelDetailRequestDto: CreateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('create...');

    const customerDetailHotel = this.classMapper.map(
      createCustomerHotelDetailRequestDto,
      CreateCustomerHotelDetailRequestDto,
      CustomerHotelDetail,
    );
    customerDetailHotel.userId = this.request.user?.id ?? null;

    const customerDetailHotelDB =
      await this.customerHotelDetailsRepository.fetchByAllDetails(
        customerDetailHotel,
      );

    if (!customerDetailHotelDB)
      return await this.customerHotelDetailsRepository.create(
        customerDetailHotel,
      );
    return customerDetailHotelDB;
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.customerHotelDetailsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const bookingHotel = await this.customerHotelDetailsRepository.fetchById(
      id,
    );
    if (!bookingHotel)
      this.errorHandlerService.notFoundException('Id not found');
    return bookingHotel;
  }

  async update(
    updateCustomerHotelDetailRequestDto: UpdateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateCustomerHotelDetailRequestDto;
    const bookingHotelDB = await this.customerHotelDetailsRepository.fetchById(
      id,
    );
    if (!bookingHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const bookingHotel = this.classMapper.map(
      updateCustomerHotelDetailRequestDto,
      UpdateCustomerHotelDetailRequestDto,
      CustomerHotelDetail,
    );

    return await this.customerHotelDetailsRepository.update(bookingHotel);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const paymentHotel = await this.customerHotelDetailsRepository.fetchById(
      id,
    );
    if (!paymentHotel)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.customerHotelDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByAllDetails(
    createCustomerHotelDetailRequestDto: CreateCustomerHotelDetailRequestDto,
  ) {
    this.loggerService.log('fetchByAllDetails...');

    const customerHotelDetail = this.classMapper.map(
      createCustomerHotelDetailRequestDto,
      CreateCustomerHotelDetailRequestDto,
      CustomerHotelDetail,
    );

    return await this.customerHotelDetailsRepository.fetchByAllDetails(
      customerHotelDetail,
    );
  }
}
