import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePassengerDetailRequestDto } from './dtos/request/create-passenger-detail-request.dto';
import { UpdatePassengerDetailRequestDto } from './dtos/request/update-passenger-detail-request.dto';
import { PassengerDetail } from './passenger-detail.entity';
import { PassengerDetailsRepository } from './passenger-details.repository';

@Injectable()
export class PassengerDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly passengerDetailsRepository: PassengerDetailsRepository,
  ) {}

  async create(
    createPassengerDetailRequestDto: CreatePassengerDetailRequestDto,
  ) {
    this.loggerService.log('create...');

    const passengerDetail = this.classMapper.map(
      createPassengerDetailRequestDto,
      CreatePassengerDetailRequestDto,
      PassengerDetail,
    );
    passengerDetail.userId = this.request.user?.id ?? null;

    return await this.passengerDetailsRepository.create(passengerDetail);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.passengerDetailsRepository.fetchAll();
  }

  async fetchAllByBookingFlightsId(bookingFlightsId: number) {
    this.loggerService.log('fetchAllByBookingFlightsId...');
    return await this.passengerDetailsRepository.fetchAllByBookingFlightsId(
      bookingFlightsId,
    );
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const passengerDetailDB = await this.passengerDetailsRepository.fetchById(
      id,
    );
    if (!passengerDetailDB)
      this.errorHandlerService.notFoundException('Id not found');

    return passengerDetailDB;
  }

  async update(
    updatePassengerDetailRequestDto: UpdatePassengerDetailRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updatePassengerDetailRequestDto;
    const passengerDetailDB = await this.passengerDetailsRepository.fetchById(
      id,
    );
    if (!passengerDetailDB)
      this.errorHandlerService.notFoundException('Id not found');

    const passengerDetail = this.classMapper.map(
      updatePassengerDetailRequestDto,
      UpdatePassengerDetailRequestDto,
      PassengerDetail,
    );

    return await this.passengerDetailsRepository.update(passengerDetail);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const passengerDetailDB = await this.passengerDetailsRepository.fetchById(
      id,
    );
    if (!passengerDetailDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.passengerDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
