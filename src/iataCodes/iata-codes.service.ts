import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

import { CabinClass } from '../pricings/flights/cabin-class.enum';
import { ErrorHandlerService } from '../utils/error-handler.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { CreateIataCodeRequestDto } from './dtos/request/create-iata-code-request.dto';
import { UpdateIataCodeRequestDto } from './dtos/request/update-iata-code-request.dto';
import { IataCode } from './iata-code.entity';
import { IataCodesRepository } from './iata-codes.repository';

@Injectable()
export class IataCodesService {
  constructor(
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly iataCodesRepository: IataCodesRepository,
  ) {}

  async create(createIataCodeRequestDto: CreateIataCodeRequestDto) {
    this.loggerService.log('create...');

    const iataCode = this.classMapper.map(
      createIataCodeRequestDto,
      CreateIataCodeRequestDto,
      IataCode,
    );
    return await this.iataCodesRepository.create(iataCode);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.iataCodesRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const iataCode = await this.iataCodesRepository.fetchById(id);
    if (!iataCode) this.errorHandlerService.notFoundException('Id not found');
    return iataCode;
  }

  async update(updateIataCodeRequestDto: UpdateIataCodeRequestDto) {
    this.loggerService.log('update...');
    const { id } = updateIataCodeRequestDto;
    const iataCodeDB = await this.iataCodesRepository.fetchById(id);
    if (!iataCodeDB) this.errorHandlerService.notFoundException('Id not found');

    const iataCode = this.classMapper.map(
      updateIataCodeRequestDto,
      UpdateIataCodeRequestDto,
      IataCode,
    );

    return await this.iataCodesRepository.update(iataCode);
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const iataCodeDB = await this.iataCodesRepository.fetchById(id);
    if (!iataCodeDB) this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.iataCodesRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchByIdAndCabinClass(id: number, cabinClass: CabinClass) {
    this.loggerService.log('fetchByIdAndCabinClass...');
    return await this.iataCodesRepository.fetchByIdAndCabinClass(
      id,
      cabinClass,
    );
  }
}
