import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../../utils/error-handler.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { CreateTboHotelDetailRequestDto } from './dtos/request/create-tbo-hotel-detail-request.dto';
import { UpdateTboHotelDetailRequestDto } from './dtos/request/update-tbo-hotel-detail.request.dto';
import { TboHotelDetail } from './tbo-hotel-detail.entity';
import { TboHotelDetailsRepository } from './tbo-hotel-details.repository';

@Injectable()
export class TboHotelDetailsService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly tboHotelDetailsRepository: TboHotelDetailsRepository,
  ) {}

  async create(createTboHotelDetailRequestDto: CreateTboHotelDetailRequestDto) {
    this.loggerService.log('create...');

    const tboHotelDetail = this.classMapper.map(
      createTboHotelDetailRequestDto,
      CreateTboHotelDetailRequestDto,
      TboHotelDetail,
    );
    tboHotelDetail.userId = this.request.user?.id ?? null;

    return await this.tboHotelDetailsRepository.create(tboHotelDetail);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');
    return await this.tboHotelDetailsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('fetchById...');

    const tboHotelDetail = await this.tboHotelDetailsRepository.fetchById(id);
    if (!tboHotelDetail)
      this.errorHandlerService.notFoundException('Id not found');

    return tboHotelDetail;
  }

  async update(updateTboHotelDetailRequestDto: UpdateTboHotelDetailRequestDto) {
    this.loggerService.log('update...');

    const { id } = updateTboHotelDetailRequestDto;
    const tboHotelDetailDB = await this.tboHotelDetailsRepository.fetchById(id);
    if (!tboHotelDetailDB)
      this.errorHandlerService.notFoundException('Id not found');

    const tboHotelDetail = this.classMapper.map(
      updateTboHotelDetailRequestDto,
      UpdateTboHotelDetailRequestDto,
      TboHotelDetail,
    );

    return await this.tboHotelDetailsRepository.update(tboHotelDetail);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const tboHotelDetailDB = await this.tboHotelDetailsRepository.fetchById(id);
    if (!tboHotelDetailDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.tboHotelDetailsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
