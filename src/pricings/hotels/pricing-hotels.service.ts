import { Cache } from 'cache-manager';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CreatePricingHotelRequestDto } from './dtos/request/create-pricing-hotel-request.dto';
import { UpdatePricingHotelRequestDto } from './dtos/request/update-pricing-hotel-request.dto';
import { PricingHotel } from './pricing-hotel.entity';
import { PricingHotelsRepository } from './pricing-hotels.repository';

@Injectable()
export class PricingHotelsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly pricingHotelsRepository: PricingHotelsRepository,
  ) {}

  async create(createPricingHotelRequestDto: CreatePricingHotelRequestDto) {
    this.loggerService.log('create...');

    const pricingHotel = this.classMapper.map(
      createPricingHotelRequestDto,
      CreatePricingHotelRequestDto,
      PricingHotel,
    );
    return await this.pricingHotelsRepository.create(pricingHotel);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.pricingHotelsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const pricingHotel = await this.pricingHotelsRepository.fetchById(id);
    if (!pricingHotel)
      this.errorHandlerService.notFoundException('Id not found');

    return pricingHotel;
  }

  async update(updatePricingHotelRequestDto: UpdatePricingHotelRequestDto) {
    this.loggerService.log('update...');
    const { id } = updatePricingHotelRequestDto;
    const pricingHotelDB = await this.pricingHotelsRepository.fetchById(id);
    if (!pricingHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const pricingHotel = this.classMapper.map(
      updatePricingHotelRequestDto,
      UpdatePricingHotelRequestDto,
      PricingHotel,
    );

    const [result] = await Promise.all([
      this.pricingHotelsRepository.update(pricingHotel),
      this.cacheManager.reset(),
    ]);

    return result;
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const pricingHotelDB = await this.pricingHotelsRepository.fetchById(id);
    if (!pricingHotelDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.pricingHotelsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }
}
