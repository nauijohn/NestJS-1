import { Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CabinClass } from '../../pricings/flights/cabin-class.enum';
import { PriceMargin } from '../../pricings/flights/price-margin.enum';
import { PricingFlightsService } from '../../pricings/flights/pricing-flights.service';
import { AggregatesService } from '../../providers/aggregates/aggregates.service';
import { MystiflyFareRulesRequestDto } from '../../providers/mystifly/flight-utils/dtos/request/mystifly-fare-rules-request.dto';
import { MystiflyFlightUtilsService } from '../../providers/mystifly/flight-utils/mystifly-flight-utils.service';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { FlightsUtil } from '../flights.util';
import { OneWayBookFlightsRequestDto } from './dtos/request/one-way-book-flights-request.dto';
import { OneWayPreBookFlightsRequestDto } from './dtos/request/one-way-pre-book-flights-request.dto';
import { OneWaySearchFlightsRequestDto } from './dtos/request/one-way-search-flights-request.dto';
import { MystiflyData } from './dtos/response/one-way-search-flights-response.dto';

type PricingsType = {
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
};

@Injectable()
export class OneWayService extends FlightsUtil {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly aggregatesService: AggregatesService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
    private readonly pricingFlightsService: PricingFlightsService,
  ) {
    super(aggregatesService, configService, mystiflyFlightUtilsService);
  }

  async search(oneWaySearchFlightsRequestDto: OneWaySearchFlightsRequestDto) {
    this.loggerService.log('search...');

    const { departureDate, destinationCode, originCode, passengers } =
      oneWaySearchFlightsRequestDto;
    const { adults, children, infants } = passengers;

    const cacheName =
      `flights_oneway_${departureDate}_${originCode}_${destinationCode}_${adults}_${
        children ?? 0
      }_${infants ?? 0}`.replaceAll('/', '_');
    const cachedData: MystiflyData = await this.cacheManager.get(cacheName);
    if (cachedData) {
      this.loggerService.log('get cache...');
      cachedData.mystifly.ConversationId = uuidv4();
      return cachedData;
    }

    const pricings = await this.determinePricingsCache();

    const { mystiflyData, conversationId } = await this.mystiflySearchOneWay(
      oneWaySearchFlightsRequestDto,
      pricings,
    );

    const result = {
      mystifly: { ConversationId: conversationId, Data: mystiflyData },
    };
    await this.cacheManager.set(cacheName, result);

    return result;
  }

  async preBook(
    oneWayPreBookFlightsRequestDto: OneWayPreBookFlightsRequestDto,
  ) {
    this.loggerService.log('preBook...');

    const { conversationId, fareSourceCode } = oneWayPreBookFlightsRequestDto;

    const fareRulesRequestDto: MystiflyFareRulesRequestDto = {
      FareSourceCode: fareSourceCode,
      ConversationId: conversationId,
    };

    const [fareRulesResult, revalidationResult, pricings] = await Promise.all([
      this.mystiflyFlightUtilsService.fareRules(fareRulesRequestDto),
      this.mystiflyFlightUtilsService.revalidation(fareRulesRequestDto),
      this.determinePricingsCache(),
    ]);
    if (!fareRulesResult.Success)
      this.errorHandlerService.internalServerErrorException(
        fareRulesResult.Message,
      );
    if (!revalidationResult.Success)
      this.errorHandlerService.internalServerErrorException(
        revalidationResult.Data.Errors,
      );

    return {
      fareRules: fareRulesResult.Data,
      revalidation: this.setMystiflyRevalidationPricing(
        revalidationResult,
        pricings,
      ).Data,
    };
  }

  async book(oneWayBookFlightsRequestDto: OneWayBookFlightsRequestDto) {
    this.loggerService.log('book...');

    console.log('oneWayBookFlightsRequestDto: ', oneWayBookFlightsRequestDto);

    const mystiflyBookResult = await this.mystiflyFlightUtilsService.book(
      oneWayBookFlightsRequestDto,
    );

    console.log('mystiflyBookResult: ', mystiflyBookResult);

    if (!mystiflyBookResult.Success)
      this.errorHandlerService.internalServerErrorException(mystiflyBookResult);

    return mystiflyBookResult.Data;
  }

  private async determinePricingsCache() {
    let pricings: PricingsType = {};
    const pricingsCache: PricingsType =
      await this.cacheManager.get<PricingsType>('pricings');
    if (pricingsCache) {
      pricings = pricingsCache;
    } else {
      pricings =
        await this.pricingFlightsService.fetchAllSortByCabinClassSortByIataCode();
      await this.cacheManager.set('pricings', pricings);
    }

    return pricings;
  }
}
