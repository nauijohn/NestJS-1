import crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MyLoggerService } from '../../../utils/my-logger.service';
import { AmadeusConfig } from '../amadeus.config';
import { AmadeusFlightsSearchRequestDto } from './dtos/request/amadeus-flights-search-request.dto';
import { AmadeusFlightsSearchResponseDto } from './dtos/response/amadeus-flights-search-response.dto';

@Injectable()
export class AmadeusFlightsService extends AmadeusConfig {
  constructor(
    private readonly configureService: ConfigService,
    private readonly loggerService: MyLoggerService,
  ) {
    super(configureService);
  }

  async search(
    amadeusFlightsSearchRequestDto: AmadeusFlightsSearchRequestDto,
  ): Promise<AmadeusFlightsSearchResponseDto> {
    this.loggerService.log('search...');

    amadeusFlightsSearchRequestDto.currencyCode = this.CURRENCY_CODE;
    amadeusFlightsSearchRequestDto.sources = this.SOURCES;

    try {
      return (
        await this.amadeus.shopping.flightOffersSearch.post(
          JSON.stringify(amadeusFlightsSearchRequestDto),
        )
      ).result;
    } catch (ex) {
      return ex;
    }
  }

  async pricing(amadeusFlightsPricingRequestDto: any) {
    this.loggerService.log('pricing...');

    return (
      await this.amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [amadeusFlightsPricingRequestDto],
          },
        }),
      )
    ).result;
  }

  async order(amadeusFlightsOrderRequestDto: any) {
    this.loggerService.log('order...');

    const { result } = await this.amadeus.booking.flightOrders.post(
      JSON.stringify({
        data: {
          type: 'flight-order',
          flightOffers: [amadeusFlightsOrderRequestDto],
          travelers: [
            {
              id: '1',
              dateOfBirth: '1982-01-16',
              name: {
                firstName: 'JORGE',
                lastName: 'GONZALES',
              },
              gender: 'MALE',
              contact: {
                emailAddress: 'jorge.gonzales833@telefonica.es',
                phones: [
                  {
                    deviceType: 'MOBILE',
                    countryCallingCode: '34',
                    number: '480080076',
                  },
                ],
              },
              documents: [
                {
                  documentType: 'PASSPORT',
                  birthPlace: 'Madrid',
                  issuanceLocation: 'Madrid',
                  issuanceDate: '2015-04-14',
                  number: '00000000',
                  expiryDate: '2025-04-14',
                  issuanceCountry: 'ES',
                  validityCountry: 'ES',
                  nationality: 'ES',
                  holder: true,
                },
              ],
            },
          ],
        },
      }),
    );
    return result;
  }

  async orderManagement(id: string) {
    this.loggerService.log('orderManagement...');

    const { result } = await this.amadeus.booking.flightOrder(id).get();
    return result;
  }
}
