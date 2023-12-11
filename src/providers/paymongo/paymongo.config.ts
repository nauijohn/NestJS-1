import { ConfigService } from '@nestjs/config';

import {
  PAYMONGO_AUTHORIZATION,
  PAYMONGO_BASE_URL,
} from '../../config/config.constant';

export class PaymongoConfig {
  protected readonly BASE_URL = this.configService.get(PAYMONGO_BASE_URL);
  protected readonly AUTHORIZATION = this.configService.get(
    PAYMONGO_AUTHORIZATION,
  );
  protected readonly config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${this.AUTHORIZATION}`,
    },
  };

  constructor(protected readonly configService: ConfigService) {}
}
