import { Module } from '@nestjs/common';

import { UtilsModule } from '../../utils/utils.module';
import { AwsS3Controller } from './aws-s3.controller';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [UtilsModule],
  controllers: [AwsS3Controller],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
