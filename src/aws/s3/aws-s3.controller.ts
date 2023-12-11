import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../auth/decorators/is-public.decorator';
import { MyLoggerService } from '../../utils/my-logger.service';
import { AwsS3Service } from './aws-s3.service';

@Controller()
@ApiTags('AWS')
export class AwsS3Controller {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly loggerService: MyLoggerService,
  ) {}

  @Post()
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name?: string,
  ) {
    this.loggerService.log('uploadFile...');

    return this.awsS3Service.uploadFile(file, name);
  }

  @Get()
  @Public()
  async getS3Objects() {
    this.loggerService.log('getS3Objects...');

    return await this.awsS3Service.getS3Objects();
  }

  @Get(':key')
  @Public()
  async getS3ObjectByKey(@Param('key') key: string) {
    this.loggerService.log('getS3ObjectByKey...');

    return await this.awsS3Service.getS3ObjectByKey(key);
  }
}
