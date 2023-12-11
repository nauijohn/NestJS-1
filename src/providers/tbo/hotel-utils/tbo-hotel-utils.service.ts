import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { TboCitiesResponseDto } from './dtos/response/tbo-cities-response.dto';
import { TboCountriesResponseDto } from './dtos/response/tbo-countries-response.dto';
import { TboHotelUtilsConfig } from './tbo-hotel-utils.config';

@Injectable()
export class TboHotelUtilsService extends TboHotelUtilsConfig {
  private readonly COUNTRY_LIST = `${this.BASE_URL}/CountryList`;
  private readonly CITY_LIST = `${this.BASE_URL}/CityList`;

  constructor(
    private readonly configureService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: MyLoggerService,
  ) {
    super(configureService);
  }

  async fetchCountries() {
    this.loggerService.log('fetchCountries...');

    const { data } = await firstValueFrom(
      this.httpService
        .get<TboCountriesResponseDto>(this.COUNTRY_LIST, this.config)
        .pipe(
          catchError((error: AxiosError) => {
            this.loggerService.error('error', error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async fetchCitiesOfCountry(countryCode: string) {
    this.loggerService.log('fetchCitiesOfCountry...');

    const requestBody = { CountryCode: countryCode };
    const { data } = await firstValueFrom(
      this.httpService
        .post<TboCitiesResponseDto>(this.CITY_LIST, requestBody, this.config)
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
