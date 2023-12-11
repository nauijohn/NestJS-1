import { ConfigService } from '@nestjs/config';

import {
  TBO_AUTH_PASSWORD,
  TBO_AUTH_USERNAME,
  TBO_BASE_URL,
} from '../../../config/config.constant';

export class TboHotelUtilsConfig {
  protected readonly BASE_URL = this.configService.get(TBO_BASE_URL);
  protected readonly AUTH_USERNAME = this.configService.get(TBO_AUTH_USERNAME);
  protected readonly AUTH_PASSWORD = this.configService.get(TBO_AUTH_PASSWORD);
  protected readonly config = {
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
    },
    auth: {
      username: this.AUTH_USERNAME,
      password: this.AUTH_PASSWORD,
    },
  };

  constructor(protected readonly configService: ConfigService) {}
}
