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
import { OneWayBookFlightsRequestDto } from '../one-way/dtos/request/one-way-book-flights-request.dto';
import { RoundtripBookFlightsRequestDto } from './dtos/request/roundtrip-book-flights-request.dto';
import { RoundtripPreBookFlightsRequestDto } from './dtos/request/roundtrip-pre-book-flights-request.dto';
import { RoundtripSearchFlightsRequestDto } from './dtos/request/roundtrip-search-flights-request.dto';
import { RoundtripData } from './dtos/response/roundtrip-search-flights-response.dto';

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
export class RoundtripService extends FlightsUtil {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerService: ErrorHandlerService,
    private readonly mystiflyFlightUtilsService: MystiflyFlightUtilsService,
    private readonly aggregatesService: AggregatesService,
    private readonly pricingFlightsService: PricingFlightsService,
  ) {
    super(aggregatesService, configService, mystiflyFlightUtilsService);
  }

  async search(
    roundtripSearchFlightsRequestDto: RoundtripSearchFlightsRequestDto,
  ) {
    this.loggerService.log('search...');

    const {
      departureDate,
      destinationCode,
      originCode,
      passengers,
      returnDate,
    } = roundtripSearchFlightsRequestDto;
    const { adults, children, infants } = passengers;

    const cacheName =
      `flights_roundtrip_${departureDate}_${returnDate}_${originCode}_${destinationCode}_${adults}_${
        children ?? 0
      }_${infants ?? 0}`.replaceAll('/', '_');
    const cachedData: RoundtripData = await this.cacheManager.get(cacheName);
    if (cachedData) {
      this.loggerService.log('get cache...');
      cachedData.mystifly.departureFlights.ConversationId = uuidv4();
      cachedData.mystifly.returnFlights.ConversationId = uuidv4();
      return cachedData;
    }

    const pricings = await this.determinePricingsCache();

    const { Depart, Return } = await this.mystiflySearchRoundtrip(
      roundtripSearchFlightsRequestDto,
      pricings,
    );

    const result = {
      mystifly: {
        departureFlights: {
          ConversationId: Depart.ConversationIdDepart,
          Data: Depart.MystiflyDepartDataWithPricing,
        },
        returnFlights: {
          ConversationId: Return.ConversationIdReturn,
          Data: Return.MystiflyReturnDataWithPricing,
        },
      },
    };
    await this.cacheManager.set(cacheName, result);

    return result;
  }

  async preBook(
    roundtripPreBookFlightsRequestDto: RoundtripPreBookFlightsRequestDto,
  ) {
    this.loggerService.log('preBook...');

    const { departureRequest, returnRequest } =
      roundtripPreBookFlightsRequestDto;

    const {
      conversationId: conversationIdDeparture,
      fareSourceCode: fareSourceCodeDeparture,
    } = departureRequest;

    const {
      conversationId: conversationIdReturn,
      fareSourceCode: fareSourceCodeReturn,
    } = returnRequest;

    const fareRulesRequestDtoDeparture: MystiflyFareRulesRequestDto = {
      FareSourceCode: fareSourceCodeDeparture,
      ConversationId: conversationIdDeparture,
    };

    const fareRulesRequestDtoReturn: MystiflyFareRulesRequestDto = {
      FareSourceCode: fareSourceCodeReturn,
      ConversationId: conversationIdReturn,
    };

    const [
      fareRulesResultDeparture,
      fareRulesResultReturn,
      revalidationResultDeparture,
      revalidationResultReturn,
      pricings,
    ] = await Promise.all([
      this.mystiflyFlightUtilsService.fareRules(fareRulesRequestDtoDeparture),
      this.mystiflyFlightUtilsService.fareRules(fareRulesRequestDtoReturn),
      this.mystiflyFlightUtilsService.revalidation(
        fareRulesRequestDtoDeparture,
      ),
      this.mystiflyFlightUtilsService.revalidation(fareRulesRequestDtoReturn),
      this.determinePricingsCache(),
    ]);
    if (!fareRulesResultDeparture.Success)
      this.errorHandlerService.internalServerErrorException(
        `fareRulesResultDeparture: ${fareRulesResultDeparture.Message}`,
      );
    if (!fareRulesResultReturn.Success)
      this.errorHandlerService.internalServerErrorException(
        `fareRulesResultReturn: ${fareRulesResultReturn.Message}`,
      );
    if (!revalidationResultDeparture.Success)
      this.errorHandlerService.internalServerErrorException(
        `revalidationResultDeparture: ${revalidationResultDeparture.Data.Errors}`,
      );
    if (!revalidationResultReturn.Success)
      this.errorHandlerService.internalServerErrorException(
        `revalidationResultReturn: ${revalidationResultReturn.Data.Errors}`,
      );
    return {
      departure: {
        fareRules: fareRulesResultDeparture.Data,
        revalidation: this.setMystiflyRevalidationPricing(
          revalidationResultDeparture,
          pricings,
        ).Data,
      },
      return: {
        fareRules: fareRulesResultReturn.Data,
        revalidation: this.setMystiflyRevalidationPricing(
          revalidationResultReturn,
          pricings,
        ).Data,
      },
    };
  }

  async book(roundtripBookFlightsRequestDto: RoundtripBookFlightsRequestDto) {
    this.loggerService.log('book...');

    const { departureDetails, returnDetails } = roundtripBookFlightsRequestDto;

    const mystiflyBookRequestDeparture: OneWayBookFlightsRequestDto = {
      FareSourceCode: departureDetails.fareSourceCode,
      ConversationId: departureDetails.conversationId,
      TravelerInfo: departureDetails.TravelerInfo,
    };

    const mystiflyBookRequestReturn: OneWayBookFlightsRequestDto = {
      FareSourceCode: returnDetails.fareSourceCode,
      ConversationId: returnDetails.conversationId,
      TravelerInfo: returnDetails.TravelerInfo,
    };

    const [mystiflyBookResultDeparture, mystiflyBookResultReturn] =
      await Promise.all([
        this.mystiflyFlightUtilsService.book(mystiflyBookRequestDeparture),
        this.mystiflyFlightUtilsService.book(mystiflyBookRequestReturn),
      ]);

    if (!mystiflyBookResultDeparture.Success)
      this.errorHandlerService.internalServerErrorException(
        mystiflyBookResultDeparture.Message,
      );

    if (!mystiflyBookResultReturn.Success)
      this.errorHandlerService.internalServerErrorException(
        mystiflyBookResultReturn.Message,
      );

    return {
      departureDetails: mystiflyBookResultDeparture.Data,
      returnDetails: mystiflyBookResultReturn.Data,
    };
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
