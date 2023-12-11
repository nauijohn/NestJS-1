import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import * as zlib from 'zlib';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AmadeusFlightsService } from '../../../providers/amadeus/flights/amadeus-flights.service';
import { AmadeusFlightsSearchRequestDto } from '../../../providers/amadeus/flights/dtos/request/amadeus-flights-search-request.dto';
import { MyLoggerService } from '../../../utils/my-logger.service';
import { TripninjaConfig } from '../tripninja.config';
import { TripninjaFlightsGenerateSolutionsRequestDto } from './dtos/request/tripninja-flights-generate-solutions-request.dto';
import { TripninjaFlightsParseAmadeusRequestDto } from './dtos/request/tripninja-flights-parse-amadeus-request.dto';
import { TripninjaFlightsSearchRequestDto } from './dtos/request/tripninja-flights-search-request.dto';
import { TripninjaFlightsGenerateSolutionsResponseDto } from './dtos/response/tripninja-flights-generate-solutions-response.dto';
import { TripninjaFlightsParseAmadeusResponseDto } from './dtos/response/tripninja-flights-parse-amadeus-response.dto';
import { TripninjaFlightsSearchResponseDto } from './dtos/response/tripninja-flights-search-response.dto';

@Injectable()
export class TripninjaFlightsService extends TripninjaConfig {
  constructor(
    private readonly configureService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: MyLoggerService,
    private readonly amadeusFlightsService: AmadeusFlightsService,
  ) {
    super(configureService);
  }

  async search(
    tripninjaFlightsSearchRequestDto: TripninjaFlightsSearchRequestDto,
  ) {
    this.loggerService.log('search...');

    const { data } = await firstValueFrom(
      this.httpService
        .post<TripninjaFlightsSearchResponseDto>(
          `${this.BASE_URL}/v2/get-searches/`,
          tripninjaFlightsSearchRequestDto,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async generateSolutions(
    tripninjaFlightsGenerateSolutionsRequestDto: TripninjaFlightsGenerateSolutionsRequestDto,
  ) {
    this.loggerService.log('generateSolutions...');

    const buffer = await promisify(zlib.deflate)(
      JSON.stringify(tripninjaFlightsGenerateSolutionsRequestDto),
    );
    const b64encodedCompressedRequest = buffer.toString('base64');
    const requestBody = { compressedData: b64encodedCompressedRequest };

    const { data } = await firstValueFrom(
      this.httpService
        .post<TripninjaFlightsGenerateSolutionsResponseDto>(
          `${this.BASE_URL}/v2/generate-solutions/`,
          requestBody,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async parseSearchResults(
    tripninjaFlightsParseAmadeusRequestDto: TripninjaFlightsParseAmadeusRequestDto,
  ): Promise<TripninjaFlightsParseAmadeusResponseDto> {
    const requests =
      tripninjaFlightsParseAmadeusRequestDto.datasource_requests.map(
        (datasource_request) => {
          const originDestinations = datasource_request.datasource_segments.map(
            (segment) => {
              return {
                id: segment.id.toString(),
                originLocationCode: segment.from_iata,
                destinationLocationCode: segment.to_iata,
                departureDateTimeRange: {
                  date: segment.departure_date,
                },
              };
            },
          );

          const travelers =
            tripninjaFlightsParseAmadeusRequestDto.travellers.map(
              (traveller, index) => {
                return {
                  id: (+index + 1).toString(),
                  travelerType: traveller === 'ADT' ? 'ADULT' : '',
                };
              },
            );
          return { originDestinations, travelers };
        },
      );

    const amadeusFlightsSearchRequestDtos = requests.map((request) => {
      const { originDestinations, travelers } = request;
      const amadeusFlightsSearchRequestDto: AmadeusFlightsSearchRequestDto = {
        originDestinations,
        travelers,
        currencyCode: '',
        sources: [],
      };
      return amadeusFlightsSearchRequestDto;
    });

    const amadeusResults = await Promise.all(
      amadeusFlightsSearchRequestDtos.map((amadeusFlightsSearchRequestDto) => {
        return this.amadeusFlightsService.search(
          amadeusFlightsSearchRequestDto,
        );
      }),
    );

    const parsedAmadeusResults = amadeusResults.map((amadeusResult) => {
      return !amadeusResult.data
        ? 'ClientError'
        : amadeusResult.data.map((datum) => {
            return {
              pricing_solution_id: uuidv4(),
              total_price: parseFloat(datum.price.total),
              segment_source: datum.source,
              segments: datum.itineraries.map((itinerary) => {
                return itinerary.segments.map((segment) => {
                  let cabin_class: string = '';
                  datum.travelerPricings[0].fareDetailsBySegment.forEach(
                    (fareDetail) => {
                      if (fareDetail.segmentId === segment.id) {
                        if (fareDetail.cabin === 'ECONOMY') cabin_class = 'E';
                      }
                    },
                  );
                  return {
                    departure_time: segment.departure.at.split('T')[0],
                    departure_timestamp: new Date(
                      segment.departure.at,
                    ).getTime(),
                    arrival_time: segment.arrival.at.split('T')[0],
                    arrival_timestamp: new Date(segment.arrival.at).getTime(),
                    flight_number: segment.number,
                    operating_carrier: segment.carrierCode,
                    transportation_type: 'flight',
                    fare_type: 'public',
                    cabin_class,
                  };
                });
              }),
            };
          });
    });

    const datasource_responses = {};
    tripninjaFlightsParseAmadeusRequestDto.datasource_requests.forEach(
      (datasource_request, datasource_request_index) => {
        parsedAmadeusResults.forEach(
          (parsedAmadeusResult, parsedAmadeusResultIndex) => {
            if (datasource_request_index === parsedAmadeusResultIndex) {
              datasource_responses[datasource_request.datasource_request_id] =
                parsedAmadeusResult;
            }
          },
        );
      },
    );

    return {
      trip_id: tripninjaFlightsParseAmadeusRequestDto.trip_id,
      datasource_responses,
    };
  }
}
