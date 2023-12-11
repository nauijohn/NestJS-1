import { ConfigService } from '@nestjs/config';

import {
  MYSTIFLY_AUTH_BEARER,
  MYSTIFLY_BASE_URL,
  MYSTIFLY_TARGET,
} from '../../config/config.constant';
import { CredentialsService } from '../../credentials/credentials.service';
import { Providers } from '../../credentials/providers.enum';
import { MyLoggerService } from '../../utils/my-logger.service';

export class MystiflyConfig {
  protected readonly TARGET = this.configServiceConfig.get(MYSTIFLY_TARGET);
  protected readonly BASE_URL = this.configServiceConfig.get(MYSTIFLY_BASE_URL);
  protected readonly MYSTIFLY_AUTH_BEARER =
    this.configServiceConfig.get(MYSTIFLY_AUTH_BEARER);
  protected readonly config = {
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
      authorization: `Bearer ${this.MYSTIFLY_AUTH_BEARER}`,
    },
  };

  protected readonly SEARCH = `${this.BASE_URL}/v2/Search/Flight`;
  protected readonly FARE_RULES = `${this.BASE_URL}/v1/FlightFareRules`;
  protected readonly REVALIDATION = `${this.BASE_URL}/v1/Revalidate/Flight`;
  protected readonly BOOK = `${this.BASE_URL}/v1/Book/Flight`;
  protected readonly CREATE_SESSION = `${this.BASE_URL}/CreateSession`;
  protected readonly TRIP_DETAILS = `${this.BASE_URL}/TripDetails/MFRef`;
  protected readonly TRIP_DETAILS_V_1_1 = `${this.BASE_URL}/v1.1/TripDetails/MFRef`;

  constructor(
    private readonly configServiceConfig: ConfigService,
    private readonly loggerServiceConfig: MyLoggerService,
    private readonly credentialsServiceConfig: CredentialsService,
  ) {}

  protected async mystiflyCredentials() {
    this.loggerServiceConfig.log('mystiflyCredentials...');

    return await this.credentialsServiceConfig.fetchByProvider(
      Providers.Mystifly,
    );
  }
}
