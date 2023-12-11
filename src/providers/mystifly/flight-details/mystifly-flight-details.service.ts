import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightDetailRequestDto } from './dtos/request/create-mystifly-flight-detail-request.dto';
import { UpdateMystiflyFlightDetailRequestDto } from './dtos/request/update-mystifly-flight-detail-request.dto';
import { MystiflyFlightDetail } from './mystifly-flight-detail.entity';
import { MystiflyFlightDetailsRepository } from './mystifly-flight-details.repository';

@Injectable()
export class MystiflyFlightDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightDetailsRepository: MystiflyFlightDetailsRepository,
  ) {}

  async create(
    createMystiflyFlightDetailRequestDto: CreateMystiflyFlightDetailRequestDto,
  ) {
    this.loggerService.log('create...');

    const mystiflyFlight = this.classMapper.map(
      createMystiflyFlightDetailRequestDto,
      CreateMystiflyFlightDetailRequestDto,
      MystiflyFlightDetail,
    );
    mystiflyFlight.userId = this.request.user?.id ?? null;

    return await this.mystiflyFlightDetailsRepository.create(mystiflyFlight);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.mystiflyFlightDetailsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const mystiflyFlightDetail =
      await this.mystiflyFlightDetailsRepository.fetchById(id);
    if (!mystiflyFlightDetail)
      this.errorHandlerService.notFoundException('Id not found');

    return mystiflyFlightDetail;
  }

  async update(
    updateMystiflyFlightDetailRequestDto: UpdateMystiflyFlightDetailRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateMystiflyFlightDetailRequestDto;
    const paymentHotelDB = await this.mystiflyFlightDetailsRepository.fetchById(
      id,
    );
    if (!paymentHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const mystiflyFlight = this.classMapper.map(
      updateMystiflyFlightDetailRequestDto,
      UpdateMystiflyFlightDetailRequestDto,
      MystiflyFlightDetail,
    );

    return await this.mystiflyFlightDetailsRepository.update(mystiflyFlight);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const hotelPayment = await this.mystiflyFlightDetailsRepository.fetchById(
      id,
    );
    if (!hotelPayment)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.mystiflyFlightDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByProviderReference(providerReference: string) {
    this.loggerService.log('findById...');
    return await this.mystiflyFlightDetailsRepository.fetchByProviderReference(
      providerReference,
    );
  }

  async fetchByPaymentReference(paymentReference: string) {
    this.loggerService.log('fetchByPaymentReference...');
    return await this.mystiflyFlightDetailsRepository.fetchByPaymentReference(
      paymentReference,
    );
  }
}
