import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MyLoggerService } from '../../utils/my-logger.service';
import { AwsConfig } from '../aws.config';

@Injectable()
export class AwsS3Service extends AwsConfig {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly confService: ConfigService,
  ) {
    super(confService);
  }

  async uploadFile(file: Express.Multer.File, name?: string) {
    const { originalname, buffer, mimetype } = file;

    const key = String(name ?? originalname);

    return await this.s3
      .upload({
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
  }

  async uploadFile2(buffer: ArrayBuffer, mimetype: string, name?: string) {
    let fileType = '';
    switch (mimetype.split('/')[1]) {
      case 'jpeg':
        fileType = 'jpg';
        break;
      case 'png':
        fileType = 'png';
        break;
      default:
        fileType = 'jpg';
        break;
    }

    // const key = String(`${name.replace(`.${fileType}`, '')}.${fileType}`);
    const key = String(name);

    return await this.s3
      .upload({
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
        Body: buffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
      })
      .promise();
  }

  async getS3Objects() {
    this.loggerService.log('getS3Objects...');

    return await this.s3.listObjects({ Bucket: this.AWS_S3_BUCKET }).promise();
  }

  async getS3ObjectByKey(key: string) {
    this.loggerService.log('getS3ObjectByKey...');

    return await this.s3
      .getObject({ Bucket: this.AWS_S3_BUCKET, Key: key })
      .promise()
      .catch((err) => {
        if (err.statusCode === 404) return null;
        throw err;
      });
  }
}
