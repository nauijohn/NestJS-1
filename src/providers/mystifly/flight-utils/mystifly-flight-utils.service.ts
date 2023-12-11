import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CredentialsService } from '../../../credentials/credentials.service';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { SearchFlights } from '../flight-utils/interfaces/search-flights.interface';
import { MystiflyConfig } from '../mystifly.config';
import { MystiflyBookRequestDto } from './dtos/request/mystifly-book-request.dto';
import { MystiflyCreateSessionRequestDto } from './dtos/request/mystifly-create-session-request.dto';
import { MystiflyFareRulesRequestDto } from './dtos/request/mystifly-fare-rules-request.dto';
import { MystiflyRevalidationRequestDto } from './dtos/request/mystifly-revalidation-request.dto';
import { MystiflySearchFlightsRequestDto } from './dtos/request/mystifly-search-flights-request.dto';
import { MystiflyBookResponseDto } from './dtos/response/mystifly-book-response.dto';
import { MystiflyFareRulesResponseDto } from './dtos/response/mystifly-fare-rules-response.dto';
import { MystiflyRevalidationResponseDto } from './dtos/response/mystifly-revalidation-response.dto';
import { MystiflySearchResponseDto } from './dtos/response/mystifly-search-response.dto';
import { MystiflyCreateSessionResponseInterface } from './interfaces/mystifly-create-session-response.interface';

@Injectable()
export class MystiflyFlightUtilsService extends MystiflyConfig {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: MyLoggerService,
    @Inject(forwardRef(() => CredentialsService))
    private readonly credentialsService: CredentialsService,
  ) {
    super(configService, loggerService, credentialsService);
  }

  async createSession(
    mystiflyCreateSessionRequestDto: MystiflyCreateSessionRequestDto,
  ) {
    this.loggerService.log('createSession...');

    const { username, password, accountNumber } =
      mystiflyCreateSessionRequestDto;

    const requestBody = {
      UserName: username,
      Password: password,
      AccountNumber: accountNumber,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post<MystiflyCreateSessionResponseInterface>(
          this.CREATE_SESSION,
          requestBody,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async search(searchFlightsRequestDto: MystiflySearchFlightsRequestDto) {
    this.loggerService.log('searchFlights...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const ConversationId = searchFlightsRequestDto.ConversationId ?? uuidv4();
    const requestBody = {
      ...searchFlightsRequestDto,
      ConversationId,
      Target: this.TARGET,
    };

    const [{ data: data1 }, { data: data2 }] = await Promise.all([
      firstValueFrom(
        this.httpService
          .post<SearchFlights>(
            this.SEARCH,
            { ...requestBody, IsRefundable: false },
            this.config,
          )
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response)
                this.loggerService.error('error', error.response.data);
              throw error;
            }),
          ),
      ),
      firstValueFrom(
        this.httpService
          .post<SearchFlights>(
            this.SEARCH,
            { ...requestBody, IsRefundable: true },
            this.config,
          )
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response)
                this.loggerService.error('error', error.response.data);
              throw error;
            }),
          ),
      ),
    ]);

    const mystiflyData1 = this.aggregateSearchFlightData(data1);
    const mystiflyData2 = this.aggregateSearchFlightData(data2);

    const result: MystiflySearchResponseDto = {
      ConversationId,
      Data: [...mystiflyData1.Data, ...mystiflyData2.Data],
    };

    return result;
  }

  async searchFlightsRaw(
    searchFlightsRequestDto: MystiflySearchFlightsRequestDto,
  ) {
    this.loggerService.log('searchFlights...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const ConversationId = searchFlightsRequestDto.ConversationId ?? uuidv4();
    const requestBody = {
      ...searchFlightsRequestDto,
      ConversationId,
      Target: this.TARGET,
    };

    const [{ data: data1 }, { data: data2 }] = await Promise.all([
      firstValueFrom(
        this.httpService
          .post<SearchFlights>(
            this.SEARCH,
            { ...requestBody, IsRefundable: false },
            this.config,
          )
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response)
                this.loggerService.error('error', error.response.data);
              throw error;
            }),
          ),
      ),
      firstValueFrom(
        this.httpService
          .post<SearchFlights>(
            this.SEARCH,
            { ...requestBody, IsRefundable: true },
            this.config,
          )
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response)
                this.loggerService.error('error', error.response.data);
              throw error;
            }),
          ),
      ),
    ]);

    const mystiflyData1 = data1;
    const mystiflyData2 = data2;

    const result: any = {
      ConversationId,
      Data: { mystiflyData1, mystiflyData2 },
    };

    return result;
  }

  async fareRules(fareRulesRequestDto: MystiflyFareRulesRequestDto) {
    this.loggerService.log('fareRules...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const requestBody = { ...fareRulesRequestDto, Target: this.TARGET };
    const { data } = await firstValueFrom(
      this.httpService
        .post<MystiflyFareRulesResponseDto>(
          this.FARE_RULES,
          requestBody,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async revalidation(revalidationRequestDto: MystiflyRevalidationRequestDto) {
    this.loggerService.log('revalidation...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const requestBody = { ...revalidationRequestDto, Target: this.TARGET };
    const { data } = await firstValueFrom(
      this.httpService
        .post<MystiflyRevalidationResponseDto>(
          this.REVALIDATION,
          requestBody,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async book(bookRequestDto: MystiflyBookRequestDto) {
    this.loggerService.log('book...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const requestBody = { ...bookRequestDto, Target: this.TARGET };
    const { data } = await firstValueFrom(
      this.httpService
        .post<MystiflyBookResponseDto>(this.BOOK, requestBody, this.config)
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error: ', error.response.data);
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async tripDetails(id: string) {
    this.loggerService.log('tripDetails...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const { data } = await firstValueFrom(
      this.httpService
        .get(this.TRIP_DETAILS.replace('MFRef', id), this.config)
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error: ', error.response.data);
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async tripDetailsV11(id: string) {
    this.loggerService.log('tripDetailsV11...');

    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const { data } = await firstValueFrom(
      this.httpService
        .get(this.TRIP_DETAILS_V_1_1.replace('MFRef', id), this.config)
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error: ', error.response.data);
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  private aggregateSearchFlightData(data: SearchFlights) {
    const { Data: mainData } = data;
    const {
      ConversationId,
      PricedItineraries,
      FlightSegmentList,
      ItineraryReferenceList,
      FlightFaresList,
      PenaltiesInfoList,
      FulfillmentDetailsList,
    } = mainData;

    const getMappedList = <T>(list: T[], refId: number) =>
      list.find(
        (item) =>
          item[Object.keys(item).find((word) => word.endsWith('Ref'))] ===
          refId,
      );

    const aggregatedPricedItineraries =
      PricedItineraries.length > 0
        ? PricedItineraries.map((pricedItinerary) => {
            const {
              FareSourceCode,
              ValidatingCarrier,
              OriginDestinations,
              FareRef,
              PenaltiesInfoRef,
              FulfillmentDetailsRef,
              Provider,
            } = pricedItinerary;

            return {
              FareSourceCode,
              ValidatingCarrier,
              OriginDestinations:
                OriginDestinations.length > 0
                  ? OriginDestinations.map((refs) => {
                      const { SegmentRef, ItineraryRef, LegIndicator } = refs;
                      return {
                        FlightSegment: getMappedList(
                          FlightSegmentList,
                          SegmentRef,
                        ),
                        ItineraryReference: getMappedList(
                          ItineraryReferenceList,
                          ItineraryRef,
                        ),
                        LegIndicator,
                      };
                    })
                  : [],
              FlightFares: getMappedList(FlightFaresList, FareRef),
              PenaltiesInfo: getMappedList(PenaltiesInfoList, PenaltiesInfoRef),
              FulfillmentDetails: getMappedList(
                FulfillmentDetailsList,
                FulfillmentDetailsRef,
              ),
              Provider,
            };
          })
        : [];

    return {
      Data: aggregatedPricedItineraries,
      ConversationId,
    };
  }

  async wew(test: any) {
    const requestBody = {
      ...test,
      ConversationId: uuidv4(),
      Target: this.TARGET,
    };
    const { bearer } = await this.mystiflyCredentials();
    this.config.headers.authorization = `Bearer ${bearer}`;

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'https://restapidemo.myfarebox.com/api/v2/Search/Flight',
          requestBody,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error: ', error);
            this.loggerService.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }
}
