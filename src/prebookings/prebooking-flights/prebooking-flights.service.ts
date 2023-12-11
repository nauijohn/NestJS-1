import { v4 as uuidv4 } from 'uuid';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { FlightProvider } from '../../bookings/booking-flights/flight-provider.enum';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { MystiflyFlightFareRulesResponsesService } from '../../providers/mystifly/flight-fare-rules-responses/mystifly-flight-fare-rules-responses.service';
import { MystiflyFlightRevalidationResponsesService } from '../../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-responses.service';
import { UpdateTransactionFlightRequestDto } from '../../transactions/flights/dtos/request/update-transaction-flight-request.dto';
import { TransactionFlightsService } from '../../transactions/flights/transaction-flights.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreateOneWayPrebookingFlightRequestDto } from './dtos/request/create-one-way-prebooking-flight-request.dto';
import { CreatePrebookingFlightRequestDto } from './dtos/request/create-prebooking-flight-request.dto';
import { CreateRoundtripPrebookingFlightRequestDto } from './dtos/request/create-roundtrip-prebooking-flight-request.dto';
import { UpdatePrebookingFlightResponseDto } from './dtos/request/update-prebooking-flight-request.dto';
import { PrebookingFlight } from './prebooking-flight.entity';
import { PrebookingFlightsRepository } from './prebooking-flights.repository';

@Injectable()
export class PrebookingFlightsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly prebookingFlightsRepository: PrebookingFlightsRepository,
    private readonly transactionFlightsService: TransactionFlightsService,
    private readonly mystiflyFlightFareRulesResponsesService: MystiflyFlightFareRulesResponsesService,
    private readonly mystiflyFlightRevalidationResponsesService: MystiflyFlightRevalidationResponsesService,
  ) {}

  async create(
    createPrebookingFlightRequestDto: CreatePrebookingFlightRequestDto,
  ) {
    this.loggerService.log('create...');

    const prebookingFlight = this.classMapper.map(
      createPrebookingFlightRequestDto,
      CreatePrebookingFlightRequestDto,
      PrebookingFlight,
    );
    prebookingFlight.userId = this.request.user?.id ?? null;
    prebookingFlight.providerReference = uuidv4();

    return await this.prebookingFlightsRepository.create(prebookingFlight);
  }

  async createOneWay(
    createOneWayPrebookingFlightRequestDto: CreateOneWayPrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createOneWay...');
    const { providerDetails, provider, transactionId } =
      createOneWayPrebookingFlightRequestDto;

    const transactionFlightDB =
      await this.transactionFlightsService.fetchByTransactionId(transactionId);
    if (transactionFlightDB.prebookingFlight)
      this.errorHandlerService.internalServerErrorException(
        'TransactionFlight already pre-booked!',
      );

    const providerReference = uuidv4();

    const prebookingFlight = this.classMapper.map(
      createOneWayPrebookingFlightRequestDto,
      CreateOneWayPrebookingFlightRequestDto,
      PrebookingFlight,
    );
    prebookingFlight.userId = this.request.user?.id ?? null;
    prebookingFlight.providerReference = providerReference;

    const newPrebookingFlight = await this.prebookingFlightsRepository.create(
      prebookingFlight,
    );

    const updateTransactionFlightRequestDto: UpdateTransactionFlightRequestDto =
      {
        id: transactionFlightDB.id,
        prebookingFlight: newPrebookingFlight,
      };

    if (provider.toLowerCase() === FlightProvider.Mystifly) {
      const { fareRules, revalidation } = providerDetails;

      fareRules.sequence = 1;
      fareRules.providerReference = providerReference;
      fareRules.transactionId = transactionId;

      revalidation.sequence = 1;
      revalidation.providerReference = providerReference;
      revalidation.transactionId = transactionId;

      const [
        mystiflyFlightFareRulesResponse,
        mystiflyFlightRevalidationResponse,
      ] = await Promise.all([
        this.mystiflyFlightFareRulesResponsesService.create(fareRules),
        this.mystiflyFlightRevalidationResponsesService.create(revalidation),
      ]);
      updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightFareRulesResponses =
        [mystiflyFlightFareRulesResponse];
      updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightRevalidationResponses =
        [mystiflyFlightRevalidationResponse];
    }

    await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return newPrebookingFlight;
  }

  async createRoundtrip(
    createRoundtripPrebookingFlightRequestDto: CreateRoundtripPrebookingFlightRequestDto,
  ) {
    this.loggerService.log('createRoundtrip...');
    const { providerDetails, provider, transactionId } =
      createRoundtripPrebookingFlightRequestDto;

    const transactionFlightDB =
      await this.transactionFlightsService.fetchByTransactionId(transactionId);

    if (transactionFlightDB.prebookingFlight)
      this.errorHandlerService.internalServerErrorException(
        'TransactionFlight already pre-booked!',
      );

    const providerReference = uuidv4();

    const prebookingFlight = this.classMapper.map(
      createRoundtripPrebookingFlightRequestDto,
      CreateRoundtripPrebookingFlightRequestDto,
      PrebookingFlight,
    );
    prebookingFlight.userId = this.request.user?.id ?? null;
    prebookingFlight.providerReference = providerReference;
    // prebookingFlight.transactionFlight = transactionFlightDB;

    console.log('prebookingFlight: ', prebookingFlight);

    const newPrebookingFlight = await this.prebookingFlightsRepository.create(
      prebookingFlight,
    );

    const updateTransactionFlightRequestDto: UpdateTransactionFlightRequestDto =
      {
        id: transactionFlightDB.id,
        prebookingFlight: newPrebookingFlight,
      };

    if (provider.toLowerCase() === FlightProvider.Mystifly) {
      console.log('PROVIDER IS MYSTIFLY');

      const { departureDetails, returnDetails } = providerDetails;

      departureDetails.fareRules.sequence = 1;
      departureDetails.fareRules.providerReference = providerReference;
      departureDetails.fareRules.transactionId = transactionId;
      departureDetails.revalidation.sequence = 1;
      departureDetails.revalidation.providerReference = providerReference;
      departureDetails.revalidation.transactionId = transactionId;

      returnDetails.fareRules.sequence = 2;
      returnDetails.fareRules.providerReference = providerReference;
      returnDetails.fareRules.transactionId = transactionId;
      returnDetails.revalidation.sequence = 2;
      returnDetails.revalidation.providerReference = providerReference;
      returnDetails.revalidation.transactionId = transactionId;

      const [
        mystiflyFlightFareRulesResponseDeparture,
        mystiflyFlightRevalidationResponseDeparture,
        mystiflyFlightFareRulesResponseReturn,
        mystiflyFlightRevalidationResponseReturn,
      ] = await Promise.all([
        this.mystiflyFlightFareRulesResponsesService.create(
          departureDetails.fareRules,
        ),
        this.mystiflyFlightRevalidationResponsesService.create(
          departureDetails.revalidation,
        ),
        this.mystiflyFlightFareRulesResponsesService.create(
          returnDetails.fareRules,
        ),
        this.mystiflyFlightRevalidationResponsesService.create(
          returnDetails.revalidation,
        ),
      ]);

      updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightFareRulesResponses =
        [
          mystiflyFlightFareRulesResponseDeparture,
          mystiflyFlightFareRulesResponseReturn,
        ];
      updateTransactionFlightRequestDto.prebookingFlight.mystiflyFlightRevalidationResponses =
        [
          mystiflyFlightRevalidationResponseDeparture,
          mystiflyFlightRevalidationResponseReturn,
        ];
    }

    await this.transactionFlightsService.update(
      updateTransactionFlightRequestDto,
    );

    return newPrebookingFlight;
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.prebookingFlightsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const prebookingFlightDB = await this.prebookingFlightsRepository.fetchById(
      id,
    );
    if (!prebookingFlightDB)
      this.errorHandlerService.notFoundException('Id not found');

    return prebookingFlightDB;
  }

  async update(
    updatePrebookingFlightResponseDto: UpdatePrebookingFlightResponseDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updatePrebookingFlightResponseDto;
    const prebookingFlightDB = await this.prebookingFlightsRepository.fetchById(
      id,
    );
    if (!prebookingFlightDB)
      this.errorHandlerService.notFoundException('Id not found');

    const prebookingFlight = this.classMapper.map(
      updatePrebookingFlightResponseDto,
      UpdatePrebookingFlightResponseDto,
      PrebookingFlight,
    );

    return await this.prebookingFlightsRepository.update(prebookingFlight);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const prebookingFlightDB = await this.prebookingFlightsRepository.fetchById(
      id,
    );
    if (!prebookingFlightDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.prebookingFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
