import * as AWS from 'aws-sdk';

import { ConfigService } from '@nestjs/config';

export class AwsConfig {
  protected readonly AWS_S3_BUCKET = 'galago-assets';
  protected readonly s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  constructor(protected readonly configService: ConfigService) {}
}
