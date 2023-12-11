import * as Amadeus from 'amadeus';

import { ConfigService } from '@nestjs/config';

import {
  AMADEUS_CLIENT_ID,
  AMADEUS_CLIENT_SECRET,
} from '../../config/config.constant';

export class AmadeusConfig {
  protected readonly AMADEUS_CLIENT_ID =
    this.configService.get(AMADEUS_CLIENT_ID);
  protected readonly AMADEUS_CLIENT_SECRET = this.configService.get(
    AMADEUS_CLIENT_SECRET,
  );
  protected readonly amadeus = new (Amadeus as any)({
    clientId: this.AMADEUS_CLIENT_ID,
    clientSecret: this.AMADEUS_CLIENT_SECRET,
  });
  protected readonly CURRENCY_CODE = 'PHP';
  protected readonly SOURCES = ['GDS'];

  constructor(protected readonly configService: ConfigService) {}
}
