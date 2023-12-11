import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MyLoggerService } from '../../../../utils/my-logger.service';
import { TboHotelUtilsConfig } from '../tbo-hotel-utils.config';
import { TboBookRequestDto } from './dtos/request/tbo-book-request.dto';
import { TboPreBookRequestDto } from './dtos/request/tbo-pre-book-request.dto';
import { TboSearchHotelsRequestDto } from './dtos/request/tbo-search-hotels-request.dto';
import { TboHotelBookResponseDto } from './dtos/response/tbo-hotel-book-response.dto';
import { TboHotelCodesResponseDto } from './dtos/response/tbo-hotel-codes-response.dto';
import { TboHotelDetailsResponseDto } from './dtos/response/tbo-hotel-details-response.dto';
import { TboPreBookHotelsResponseDto } from './dtos/response/tbo-pre-book-hotels-response.dto';
import { TboSearchHotelsResponseDto } from './dtos/response/tbo-search-hotels-response.dto';

@Injectable()
export class TboHotelsService extends TboHotelUtilsConfig {
  private readonly SEARCH = `${this.BASE_URL}/search`;
  private readonly HOTEL_CODE_LIST = `${this.BASE_URL}/hotelcodelist`;
  private readonly TBO_HOTEL_CODE_LIST = `${this.BASE_URL}/TBOHotelCodeList`;
  private readonly PRE_BOOK = `${this.BASE_URL}/PreBook`;
  private readonly BOOK = `${this.BASE_URL}/Book`;
  private readonly HOTEL_DETAILS = `${this.BASE_URL}/Hoteldetails`;

  constructor(
    private readonly configureService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: MyLoggerService,
  ) {
    super(configureService);
  }

  async search(searchHotelsRequestDto: TboSearchHotelsRequestDto) {
    this.loggerService.log('searchFlights...');

    const { data } = await firstValueFrom(
      this.httpService
        .post<TboSearchHotelsResponseDto>(
          this.SEARCH,
          searchHotelsRequestDto,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response)
              this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async fetchCodes() {
    this.loggerService.log('fetchCodes...');

    const { data } = await firstValueFrom(
      this.httpService
        .get<{ HotelCodes: number[] }>(this.HOTEL_CODE_LIST, this.config)
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async fetchHotelCodesByCityCode(cityCode: string) {
    this.loggerService.log('fetchHotelCodesByCityCode...');

    const requestBody = { CityCode: cityCode, IsDetailedResponse: true };
    const { data } = await firstValueFrom(
      this.httpService
        .post<TboHotelCodesResponseDto>(
          this.TBO_HOTEL_CODE_LIST,
          requestBody,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async preBook(preBookRequestDto: TboPreBookRequestDto) {
    this.loggerService.log('preBook...');
    const { data } = await firstValueFrom(
      this.httpService
        .post<TboPreBookHotelsResponseDto>(
          this.PRE_BOOK,
          preBookRequestDto,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async book(tboBookRequestDto: TboBookRequestDto) {
    this.loggerService.log('book...');
    const { data } = await firstValueFrom(
      this.httpService
        .post<TboHotelBookResponseDto>(
          this.BOOK,
          tboBookRequestDto,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('error: ', error);
            this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async fetchHotelDetails(Hotelcodes: string) {
    this.loggerService.log('fetchHotelDetails...');

    const { data } = await firstValueFrom(
      this.httpService
        .post<TboHotelDetailsResponseDto>(
          this.HOTEL_DETAILS,
          { Hotelcodes },
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }
}
