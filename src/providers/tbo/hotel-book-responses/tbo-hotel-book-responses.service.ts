import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelBookResponseRequestDto } from './dtos/request/create-tbo-hotel-book-response-request.dto';
import { UpdateTboHotelBookResponseRequestDto } from './dtos/request/update-tbo-hotel-book-response-request.dto';
import { TboHotelBookResponse } from './tbo-hotel-book-response.entity';
import { TboHotelBookResponsesRepository } from './tbo-hotel-book-responses.repository';

@Injectable()
export class TboHotelBookResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelBookResponsesRepository: TboHotelBookResponsesRepository,
  ) {}

  async create(
    createTboHotelBookResponseRequestDto: CreateTboHotelBookResponseRequestDto,
  ) {
    this.loggerService.log('create...');

    const tboHotelBookResponse = this.classMapper.map(
      createTboHotelBookResponseRequestDto,
      CreateTboHotelBookResponseRequestDto,
      TboHotelBookResponse,
    );
    tboHotelBookResponse.userId = this.request.user?.id ?? null;
    // mystiflyFlightBookResponse.userId = this.request.user?.id ?? null;
    // mystiflyFlightBookResponse.transactionFlight = transactionFlight;

    return await this.tboHotelBookResponsesRepository.create(
      tboHotelBookResponse,
    );
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.tboHotelBookResponsesRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const tboHotelBookResponse =
      await this.tboHotelBookResponsesRepository.fetchById(id);
    if (!tboHotelBookResponse)
      this.errorHandlerService.notFoundException('Id not found');

    return tboHotelBookResponse;
  }

  async update(
    updateTboHotelBookResponseRequestDto: UpdateTboHotelBookResponseRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateTboHotelBookResponseRequestDto;
    const tboHotelBookResponseDB =
      await this.tboHotelBookResponsesRepository.fetchById(id);
    if (!tboHotelBookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const tboHotelBookResponse = this.classMapper.map(
      updateTboHotelBookResponseRequestDto,
      UpdateTboHotelBookResponseRequestDto,
      TboHotelBookResponse,
    );

    return await this.tboHotelBookResponsesRepository.update(
      tboHotelBookResponse,
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const tboHotelBookResponseDB =
      await this.tboHotelBookResponsesRepository.fetchById(id);
    if (!tboHotelBookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.tboHotelBookResponsesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
