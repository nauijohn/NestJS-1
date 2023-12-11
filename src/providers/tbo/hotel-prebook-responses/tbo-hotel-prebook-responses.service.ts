import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelPrebookResponseRequestDto } from './dtos/request/create-tbo-hotel-prebook-response-request.dto';
import { UpdateTboHotelPrebookResponseRequestDto } from './dtos/request/update-tbo-hotel-prebook-response-request.dto';
import { TboHotelPrebookResponse } from './tbo-hotel-prebook-response.entity';
import { TboHotelPrebookResponsesRepository } from './tbo-hotel-prebook-responses.repository';

@Injectable()
export class TboHotelPrebookResponsesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelPrebookResponsesRepository: TboHotelPrebookResponsesRepository,
  ) {}

  async create(
    createTboHotelPrebookResponseRequestDto: CreateTboHotelPrebookResponseRequestDto,
  ) {
    this.loggerService.log('create...');

    const tboHotelPrebookResponse = this.classMapper.map(
      createTboHotelPrebookResponseRequestDto,
      CreateTboHotelPrebookResponseRequestDto,
      TboHotelPrebookResponse,
    );
    tboHotelPrebookResponse.userId = this.request.user?.id ?? null;

    return await this.tboHotelPrebookResponsesRepository.create(
      tboHotelPrebookResponse,
    );
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.tboHotelPrebookResponsesRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const tboHotelPrebookResponse =
      await this.tboHotelPrebookResponsesRepository.fetchById(id);
    if (!tboHotelPrebookResponse)
      this.errorHandlerService.notFoundException('Id not found');

    return tboHotelPrebookResponse;
  }

  async update(
    updateTboHotelPrebookResponseRequestDto: UpdateTboHotelPrebookResponseRequestDto,
  ) {
    this.loggerService.log('update...');

    const { id } = updateTboHotelPrebookResponseRequestDto;
    const tboHotelPrebookResponseDB =
      await this.tboHotelPrebookResponsesRepository.fetchById(id);
    if (!tboHotelPrebookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const tboHotelPrebookResponse = this.classMapper.map(
      updateTboHotelPrebookResponseRequestDto,
      UpdateTboHotelPrebookResponseRequestDto,
      TboHotelPrebookResponse,
    );

    return await this.tboHotelPrebookResponsesRepository.update(
      tboHotelPrebookResponse,
    );
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const tboHotelPrebookResponseDB =
      await this.tboHotelPrebookResponsesRepository.fetchById(id);
    if (!tboHotelPrebookResponseDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.tboHotelPrebookResponsesRepository.deleteById(
      id,
    );
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
