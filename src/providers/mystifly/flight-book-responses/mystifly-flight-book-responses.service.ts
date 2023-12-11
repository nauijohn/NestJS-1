import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateMystiflyFlightBookResponseRequestDto } from './dtos/request/create-mystifly-flight-book-response-request.dto';
import { UpdateMystiflyFlightBookResponseRequestDto } from './dtos/request/update-mystifly-flight-book-response-request.dto';
import { MystiflyFlightBookResponse } from './mystifly-flight-book-response.entity';
import { MystiflyFlightBookResponsesRepository } from './mystifly-flight-book-responses.repository';

@Injectable()
export class MystiflyFlightBookResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightBookResponsesRepository: MystiflyFlightBookResponsesRepository,
  ) {}

  async create(
    createMystiflyFlightBookResponseRequestDto: CreateMystiflyFlightBookResponseRequestDto,
  ) {
    this.loggerService.log('create...');

    const mystiflyFlightBookResponse = this.classMapper.map(
      createMystiflyFlightBookResponseRequestDto,
      CreateMystiflyFlightBookResponseRequestDto,
      MystiflyFlightBookResponse,
    );
    // mystiflyFlightBookResponse.userId = this.request.user?.id ?? null;
    // mystiflyFlightBookResponse.transactionFlight = transactionFlight;

    return await this.mystiflyFlightBookResponsesRepository.create(
      mystiflyFlightBookResponse,
    );
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.mystiflyFlightBookResponsesRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const mystiflyFlightBookResponse =
      await this.mystiflyFlightBookResponsesRepository.fetchById(id);
    if (!mystiflyFlightBookResponse)
      this.errorHandlerService.notFoundException('Id not found');

    return mystiflyFlightBookResponse;
  }

  async update(
    updateMystiflyFlightBookResponseRequestDto: UpdateMystiflyFlightBookResponseRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateMystiflyFlightBookResponseRequestDto;
    const mystiflyFlightBookResponseDB =
      await this.mystiflyFlightBookResponsesRepository.fetchById(id);
    if (!mystiflyFlightBookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const mystiflyFlightBookResponse = this.classMapper.map(
      updateMystiflyFlightBookResponseRequestDto,
      UpdateMystiflyFlightBookResponseRequestDto,
      MystiflyFlightBookResponse,
    );

    return await this.mystiflyFlightBookResponsesRepository.update(
      mystiflyFlightBookResponse,
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const mystiflyFlightBookResponseDB =
      await this.mystiflyFlightBookResponsesRepository.fetchById(id);
    if (!mystiflyFlightBookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess =
      await this.mystiflyFlightBookResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
