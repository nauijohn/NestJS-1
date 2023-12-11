import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { TransactionFlightsService } from '../../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/create-mystifly-flight-revalidation-response-request.dto';
import { UpdateMystiflyFlightRevalidationResponseRequestDto } from './dtos/request/update-mystifly-flight-revalidation-response-request.dto';
import { MystiflyFlightRevalidationResponse } from './mystifly-flight-revalidation-response.entity';
import { MystiflyFlightRevalidationResponsesRepository } from './mystifly-flight-revalidation-responses.repository';

@Injectable()
export class MystiflyFlightRevalidationResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightRevalidationResponsesRepository: MystiflyFlightRevalidationResponsesRepository,
    private readonly transactionFlightsService: TransactionFlightsService,
  ) {}

  async create(
    createMystiflyFlightRevalidationResponseRequestDto: CreateMystiflyFlightRevalidationResponseRequestDto,
  ) {
    this.loggerService.log('create...');

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(
        createMystiflyFlightRevalidationResponseRequestDto.transactionId,
      );
    if (!transactionFlight)
      this.errorHandlerService.notFoundException(
        'TransactionFlight: Id not found',
      );

    const mystiflyFlightRevalidationResponse = this.classMapper.map(
      createMystiflyFlightRevalidationResponseRequestDto,
      CreateMystiflyFlightRevalidationResponseRequestDto,
      MystiflyFlightRevalidationResponse,
    );
    mystiflyFlightRevalidationResponse.userId = this.request.user?.id ?? null;
    // mystiflyFlightRevalidationResponse.transactionFlight = transactionFlight;

    return await this.mystiflyFlightRevalidationResponsesRepository.create(
      mystiflyFlightRevalidationResponse,
    );
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.mystiflyFlightRevalidationResponsesRepository.fetchAll();
  }

  async fetchAllByTransactionFlightId(transactionFlightId: number) {
    this.loggerService.log('fetchAllByTransactionFlightId...');
    return await this.mystiflyFlightRevalidationResponsesRepository.fetchAllByTransactionFlightId(
      transactionFlightId,
    );
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const mystiflyFlightRevalidationResponse =
      await this.mystiflyFlightRevalidationResponsesRepository.fetchById(id);
    if (!mystiflyFlightRevalidationResponse)
      this.errorHandlerService.notFoundException('Id not found');

    return mystiflyFlightRevalidationResponse;
  }

  async update(
    updateMystiflyFlightRevalidationResponseRequestDto: UpdateMystiflyFlightRevalidationResponseRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateMystiflyFlightRevalidationResponseRequestDto;
    const mystiflyFlightRevalidationResponseDB =
      await this.mystiflyFlightRevalidationResponsesRepository.fetchById(id);
    if (!mystiflyFlightRevalidationResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const mystiflyFlightRevalidationResponse = this.classMapper.map(
      updateMystiflyFlightRevalidationResponseRequestDto,
      UpdateMystiflyFlightRevalidationResponseRequestDto,
      MystiflyFlightRevalidationResponse,
    );

    return await this.mystiflyFlightRevalidationResponsesRepository.update(
      mystiflyFlightRevalidationResponse,
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const mystiflyFlightRevalidationResponseDB =
      await this.mystiflyFlightRevalidationResponsesRepository.fetchById(id);
    if (!mystiflyFlightRevalidationResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess =
      await this.mystiflyFlightRevalidationResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
