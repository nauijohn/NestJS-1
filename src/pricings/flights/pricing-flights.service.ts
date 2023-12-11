import { Cache } from 'cache-manager';
import * as _ from 'lodash';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

import { IataCode } from '../../iataCodes/iata-code.entity';
import { IataCodesService } from '../../iataCodes/iata-codes.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { CabinClass } from './cabin-class.enum';
import { CreatePricingFlightRequestDto } from './dtos/request/create-pricing-flight-request.dto';
import { UpdatePricingFlightRequestDto } from './dtos/request/update-pricing-flight-request.dto';
import { PriceMargin } from './price-margin.enum';
import { PricingFlight } from './pricing-flight.entity';
import { PricingFlightsRepository } from './pricing-flights.repository';

@Injectable()
export class PricingFlightsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly pricingFlightsRepository: PricingFlightsRepository,
    private readonly iataCodesService: IataCodesService,
  ) {}

  async create(createPricingFlightRequestDto: CreatePricingFlightRequestDto) {
    this.loggerService.log('create...');

    const { iataCode, cabinClass } = createPricingFlightRequestDto;

    await this.determinePricingForCabinClassForIataCodeExists(
      iataCode,
      cabinClass,
    );

    const pricingFlight = this.classMapper.map(
      createPricingFlightRequestDto,
      CreatePricingFlightRequestDto,
      PricingFlight,
    );
    return await this.pricingFlightsRepository.create(pricingFlight);
  }

  async fetchAll() {
    this.loggerService.log('fetchAll...');

    return await this.pricingFlightsRepository.fetchAll();
  }

  async fetchById(id: number) {
    this.loggerService.log('findById...');

    const pricingFlight = await this.pricingFlightsRepository.fetchById(id);
    if (!pricingFlight)
      this.errorHandlerService.notFoundException('Id not found');

    return pricingFlight;
  }

  async update(updatePricingFlightRequestDto: UpdatePricingFlightRequestDto) {
    this.loggerService.log('update...');
    const { id } = updatePricingFlightRequestDto;
    const pricingFlightDB = await this.pricingFlightsRepository.fetchById(id);
    if (!pricingFlightDB)
      this.errorHandlerService.notFoundException('Id not found');

    const pricingFlight = this.classMapper.map(
      updatePricingFlightRequestDto,
      UpdatePricingFlightRequestDto,
      PricingFlight,
    );

    const [result] = await Promise.all([
      this.pricingFlightsRepository.update(pricingFlight),
      this.cacheManager.reset(),
    ]);

    return result;
  }

  async deleteById(id: number) {
    this.loggerService.log('deleteById...');

    const pricingFlightDB = await this.pricingFlightsRepository.fetchById(id);
    if (!pricingFlightDB)
      this.errorHandlerService.notFoundException('Id not found');

    const isSuccess = await this.pricingFlightsRepository.deleteById(id);
    if (!isSuccess)
      this.errorHandlerService.internalServerErrorException('Delete failed!');

    return 'Delete successful!';
  }

  async fetchAllByIataCode() {
    this.loggerService.log('fetchAllByIataCode...');

    const pricingsDB = await this.pricingFlightsRepository.fetchAll();

    const mappedPricings = pricingsDB.map<{
      fixedAmount: number;
      percentage: number;
      cabinClass: CabinClass;
      iataCode: string;
    }>((pricingDB) => {
      const iataCode = pricingDB.iataCode.iataCode;
      delete pricingDB.createdAt;
      delete pricingDB.updatedAt;
      delete pricingDB.id;
      return { ...pricingDB, iataCode };
    });

    return _.mapValues(_.groupBy(mappedPricings, 'iataCode'), (clist) =>
      clist.map((car) => _.omit(car, 'iataCode')),
    );
  }

  async fetchAllSortByCabinClassSortByIataCode() {
    this.loggerService.log('fetchAllSortByCabinClassSortByIataCode...');

    const pricingsDB = await this.pricingFlightsRepository.fetchAll();

    const mappedPricings = pricingsDB.map<{
      fixedAmount: number;
      percentage: number;
      cabinClass: CabinClass;
      iataCode: string;
      priceMargin: PriceMargin;
      id: number;
    }>((pricingDB) => {
      const iataCode = pricingDB.iataCode.iataCode;
      delete pricingDB.createdAt;
      delete pricingDB.updatedAt;
      return { ...pricingDB, iataCode };
    });

    const sortedByCabinClassObj = _.mapValues(
      _.groupBy(mappedPricings, 'cabinClass'),
      (clist) => clist.map((car) => _.omit(car, 'cabinClass')),
    );

    const result: {
      [x: string]: {
        [y: string]: Pick<
          Pick<
            {
              fixedAmount: number;
              percentage: number;
              cabinClass: CabinClass;
              iataCode: string;
              priceMargin: PriceMargin;
              id: number;
            },
            'iataCode' | 'fixedAmount' | 'percentage' | 'priceMargin' | 'id'
          >,
          'fixedAmount' | 'percentage' | 'priceMargin' | 'id'
        >;
      };
    } = {};

    for (const key in sortedByCabinClassObj) {
      if (Object.prototype.hasOwnProperty.call(sortedByCabinClassObj, key)) {
        result[key] = _.mapValues(
          _.groupBy(sortedByCabinClassObj[key], 'iataCode'),
          (clist) => clist.map((car) => _.omit(car, 'iataCode'))[0],
        );
      }
    }
    return result;
  }

  private async determinePricingForCabinClassForIataCodeExists(
    iataCode: IataCode,
    cabinClass: CabinClass,
  ) {
    const [pricingFlightsDB, iataCodeDB] = await Promise.all([
      this.pricingFlightsRepository.fetchByIataCode(iataCode),
      this.iataCodesService.fetchById(iataCode.id),
    ]);

    const doesCabinClassExist = pricingFlightsDB.some(
      (pricingFlightDB) => pricingFlightDB.cabinClass === cabinClass,
    );

    if (doesCabinClassExist)
      this.errorHandlerService.badRequestException(
        `Pricing for cabinClass:${cabinClass} iataCode:${iataCodeDB.iataCode} already exists`,
      );
  }
}
