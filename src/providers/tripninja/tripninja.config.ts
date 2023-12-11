import { ConfigService } from '@nestjs/config';

import {
  TRIPNINJA_AUTH_PASSWORD,
  TRIPNINJA_AUTH_USERNAME,
  TRIPNINJA_BASE_URL,
} from '../../config/config.constant';

export class TripninjaConfig {
  protected readonly BASE_URL = this.configService.get(TRIPNINJA_BASE_URL);
  protected readonly AUTH_USERNAME = this.configService.get(
    TRIPNINJA_AUTH_USERNAME,
  );
  protected readonly AUTH_PASSWORD = this.configService.get(
    TRIPNINJA_AUTH_PASSWORD,
  );
  protected readonly config = {
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Decoding': 'deflate',
    },
    auth: {
      username: this.AUTH_USERNAME,
      password: this.AUTH_PASSWORD,
    },
  };

  constructor(protected readonly configService: ConfigService) {}
}
