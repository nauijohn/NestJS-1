import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CustomerFlightDetail } from './customer-flight-detail.entity';
import { CustomerFlightDetailsRepository } from './customer-flight-details.repository';
import { CreateCustomerFlightDetailRequestDto } from './dtos/request/create-customer-flight-detail-request.dto';
import { UpdateCustomerFlightDetailRequestDto } from './dtos/request/update-customer-flight-detail-request.dto';

@Injectable()
export class CustomerFlightDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly customerFlightDetailsRepository: CustomerFlightDetailsRepository,
  ) {}

  async create(
    createCustomerFlightDetailRequestDto: CreateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('create...');

    const customerDetailFlight = this.classMapper.map(
      createCustomerFlightDetailRequestDto,
      CreateCustomerFlightDetailRequestDto,
      CustomerFlightDetail,
    );
    customerDetailFlight.userId = this.request.user?.id ?? null;

    const customerDetailFlightDB =
      await this.customerFlightDetailsRepository.fetchByAllDetails(
        customerDetailFlight,
      );

    if (!customerDetailFlightDB)
      return await this.customerFlightDetailsRepository.create(
        customerDetailFlight,
      );
    return customerDetailFlightDB;
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.customerFlightDetailsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const bookingHotel = await this.customerFlightDetailsRepository.fetchById(
      id,
    );
    if (!bookingHotel)
      this.errorHandlerService.notFoundException('Id not found');
    return bookingHotel;
  }

  async update(
    updateCustomerFlightDetailRequestDto: UpdateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateCustomerFlightDetailRequestDto;
    const bookingHotelDB = await this.customerFlightDetailsRepository.fetchById(
      id,
    );
    if (!bookingHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const bookingFlight = this.classMapper.map(
      updateCustomerFlightDetailRequestDto,
      UpdateCustomerFlightDetailRequestDto,
      CustomerFlightDetail,
    );

    return await this.customerFlightDetailsRepository.update(bookingFlight);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const paymentFlight = await this.customerFlightDetailsRepository.fetchById(
      id,
    );
    if (!paymentFlight)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.customerFlightDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByAllDetails(
    createCustomerFlightDetailRequestDto: CreateCustomerFlightDetailRequestDto,
  ) {
    this.loggerService.log('fetchByAllDetails...');

    const customerFlightDetail = this.classMapper.map(
      createCustomerFlightDetailRequestDto,
      CreateCustomerFlightDetailRequestDto,
      CustomerFlightDetail,
    );

    return await this.customerFlightDetailsRepository.fetchByAllDetails(
      customerFlightDetail,
    );
  }
}
