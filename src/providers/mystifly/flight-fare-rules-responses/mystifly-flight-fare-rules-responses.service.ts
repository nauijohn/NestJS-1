import { v4 as uuidv4 } from 'uuid';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { TransactionFlightsService } from '../../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-fare-rules-response-request.dto';
import { CreateMystiflyFlightRoundtripFareRulesResponseRequestDto } from './dtos/request/create-mystifly-flight-roundtrip-fare-rules-response-request.dto';
import { UpdateMystiflyFlightFareRulesResponseRequestDto } from './dtos/request/update-mystifly-flight-fare-rules-response-request.dto';
import { MystiflyFlightFareRulesResponse } from './mystifly-flight-fare-rules-response.entity';
import { MystiflyFlightFareRulesResponsesRepository } from './mystifly-flight-fare-rules-responses.repository';

@Injectable()
export class MystiflyFlightFareRulesResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightFareRulesResponsesRepository: MystiflyFlightFareRulesResponsesRepository,
    private readonly transactionFlightsService: TransactionFlightsService,
  ) {}

  async create(
    createMystiflyFlightFareRulesResponseRequestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('create...');

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(
        createMystiflyFlightFareRulesResponseRequestDto.transactionId,
      );
    if (!transactionFlight)
      this.errorHandlerService.notFoundException(
        'TransactionFlight: Id not found',
      );

    const mystiflyFlightFareRulesResponse = this.classMapper.map(
      createMystiflyFlightFareRulesResponseRequestDto,
      CreateMystiflyFlightFareRulesResponseRequestDto,
      MystiflyFlightFareRulesResponse,
    );
    mystiflyFlightFareRulesResponse.userId = this.request.user?.id ?? null;
    // mystiflyFlightFareRulesResponse.transactionFlight = transactionFlight;

    return await this.mystiflyFlightFareRulesResponsesRepository.create(
      mystiflyFlightFareRulesResponse,
    );
  }

  async createOneWay(
    createMystiflyFlightFareRulesResponseRequestDto: CreateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    return await this.create(createMystiflyFlightFareRulesResponseRequestDto);
  }

  async createRoundtrip(
    createMystiflyFlightRoundtripFareRulesResponseRequestDto: CreateMystiflyFlightRoundtripFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    const {
      departureFareRulesResponse,
      returnFareRulesResponse,
      transactionId,
    } = createMystiflyFlightRoundtripFareRulesResponseRequestDto;

    const transactionFlight =
      await this.transactionFlightsService.fetchByTransactionId(transactionId);

    const providerReference = uuidv4();

    const mystiflyFlightFareRulesResponseDeparture = this.classMapper.map(
      departureFareRulesResponse,
      CreateMystiflyFlightFareRulesResponseRequestDto,
      MystiflyFlightFareRulesResponse,
    );
    mystiflyFlightFareRulesResponseDeparture.userId =
      this.request.user?.id ?? null;
    mystiflyFlightFareRulesResponseDeparture.sequence = 1;
    // mystiflyFlightFareRulesResponseDeparture.transactionFlight =
    //   transactionFlight;
    mystiflyFlightFareRulesResponseDeparture.providerReference =
      providerReference;

    const mystiflyFlightFareRulesResponseReturn = this.classMapper.map(
      returnFareRulesResponse,
      CreateMystiflyFlightFareRulesResponseRequestDto,
      MystiflyFlightFareRulesResponse,
    );
    mystiflyFlightFareRulesResponseReturn.userId =
      this.request.user?.id ?? null;
    mystiflyFlightFareRulesResponseReturn.sequence = 2;
    // mystiflyFlightFareRulesResponseReturn.transactionFlight = transactionFlight;
    mystiflyFlightFareRulesResponseReturn.providerReference = providerReference;

    const [
      mystiflyFlightFareRulesResponseDepartureResponse,
      mystiflyFlightFareRulesResponseReturnResponse,
    ] = await Promise.all([
      this.mystiflyFlightFareRulesResponsesRepository.create(
        mystiflyFlightFareRulesResponseDeparture,
      ),
      this.mystiflyFlightFareRulesResponsesRepository.create(
        mystiflyFlightFareRulesResponseReturn,
      ),
    ]);

    return {
      mystiflyFlightFareRulesResponseDeparture:
        mystiflyFlightFareRulesResponseDepartureResponse,
      mystiflyFlightFareRulesResponseReturn:
        mystiflyFlightFareRulesResponseReturnResponse,
    };
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.mystiflyFlightFareRulesResponsesRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const mystiflyFlightFareRulesResponse =
      await this.mystiflyFlightFareRulesResponsesRepository.fetchById(id);
    if (!mystiflyFlightFareRulesResponse)
      this.errorHandlerService.notFoundException('Id not found');

    return mystiflyFlightFareRulesResponse;
  }

  async update(
    updateMystiflyFlightFareRulesResponseRequestDto: UpdateMystiflyFlightFareRulesResponseRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateMystiflyFlightFareRulesResponseRequestDto;
    const mystiflyFlightFareRulesResponseDB =
      await this.mystiflyFlightFareRulesResponsesRepository.fetchById(id);
    if (!mystiflyFlightFareRulesResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const mystiflyFlightFareRulesResponse = this.classMapper.map(
      updateMystiflyFlightFareRulesResponseRequestDto,
      UpdateMystiflyFlightFareRulesResponseRequestDto,
      MystiflyFlightFareRulesResponse,
    );

    return await this.mystiflyFlightFareRulesResponsesRepository.update(
      mystiflyFlightFareRulesResponse,
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const mystiflyFlightFareRulesResponseDB =
      await this.mystiflyFlightFareRulesResponsesRepository.fetchById(id);
    if (!mystiflyFlightFareRulesResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess =
      await this.mystiflyFlightFareRulesResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
