import * as bcrypt from 'bcrypt';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { AwsS3Service } from '../../aws/s3/aws-s3.service';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ErrorHandlerService } from '../../utils/error-handler.service';
import { MyLoggerService } from '../../utils/my-logger.service';
import { ChangePasswordLocalUserRequestDto } from './dtos/request/change-password-local-user-request.dto';
import { CreateLocalUserRequestDto } from './dtos/request/create-user-request.dto';
import { UploadFileLocalUserRequestDto } from './dtos/request/upload-file-local-user-request.dto';
import { VerifyPasswordLocalUserRequestDto } from './dtos/request/verify-password-local-user-request.dto';
import { LocalUsersRepository } from './local-users.repository';

@Injectable()
export class LocalUsersService {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly localUsersRepository: LocalUsersRepository,
    private readonly loggerService: MyLoggerService,
    private readonly errorHandlerServicer: ErrorHandlerService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async create(createLocalUserRequestDto: CreateLocalUserRequestDto) {
    this.loggerService.log('create...');
    return await this.localUsersRepository.create(createLocalUserRequestDto);
  }

  async isEmailExists(email: string) {
    this.loggerService.log('isEmailExists...');
    const user = await this.localUsersRepository.findByEmail(email);
    return user ? true : false;
  }

  async findByEmail(email: string) {
    this.loggerService.log('findByEmail...');
    return await this.localUsersRepository.findByEmail(email);
  }

  async findWithPasswordByEmail(email: string) {
    this.loggerService.log('findByEmail...');
    return await this.localUsersRepository.findWithPasswordByEmail(email);
  }

  async findById(id: string) {
    this.loggerService.log('findById...');
    return await this.localUsersRepository.findById(id);
  }

  async fetchByIdWithRoles(id: string) {
    return await this.localUsersRepository.fetchByIdWithRoles(id);
  }

  async updateUserRole(userId: string, userRoleId: string) {
    return await this.localUsersRepository.updateUserRole(userId, userRoleId);
  }

  async uploadFile(file: Express.Multer.File) {
    this.loggerService.log('uploadFile...');

    console.log('file: ', file);

    const { originalname } = file;

    const fileType = originalname.split('.')[1];

    const s3Key = `${this.request.user.id}`;
    console.log('s3Key: ', s3Key);
    // const s3File = await this.awsS3Service.getS3ObjectByKey(s3Key);

    // if (s3File)
    //   this.errorHandlerServicer.conflictException(
    //     'Photo for user already exists',
    //   );

    return await this.awsS3Service.uploadFile(file, s3Key);
  }

  async uploadFile2(
    uploadFileLocalUserRequestDto: UploadFileLocalUserRequestDto,
  ) {
    this.loggerService.log('uploadFile...');

    const { base64, type: mimetype } = uploadFileLocalUserRequestDto;

    const buffer = Buffer.from(base64, 'base64');
    console.log('buffer: ', buffer);

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

    const s3Key = `${this.request.user.id}`;
    // const s3File = await this.awsS3Service.getS3ObjectByKey(s3Key);

    // if (s3File)
    //   this.errorHandlerServicer.conflictException(
    //     'Photo for user already exists',
    //   );

    return await this.awsS3Service.uploadFile2(buffer, mimetype, s3Key);
  }

  async fetchFileByKeyFromS3() {
    this.loggerService.log('fetchFileByKeyFromS3...');

    const s3Key = `${this.request.user.id}`;
    const s3File = await this.awsS3Service.getS3ObjectByKey(s3Key);

    if (!s3File)
      this.errorHandlerServicer.notFoundException('Photo for user not found');
    return s3File;
  }

  async changePassword(
    changePasswordLocalUserRequestDto: ChangePasswordLocalUserRequestDto,
  ) {
    this.loggerService.log('changePassword...');

    const { newPassword } = changePasswordLocalUserRequestDto;

    const userId = this.request.user.id;

    const { password: dbPassword } =
      await this.localUsersRepository.fetchPasswordById(userId);
    const isPasswordSame = await bcrypt.compare(newPassword, dbPassword);
    if (isPasswordSame)
      this.errorHandlerServicer.badRequestException(
        'New password cannot be the same with old password!',
      );

    const hashedNewPassword = await this.hashString(newPassword);

    const isSuccess = await this.localUsersRepository.updatePassword(
      userId,
      hashedNewPassword,
    );
    if (!isSuccess)
      this.errorHandlerServicer.internalServerErrorException(
        'Something went wrong...',
      );

    return { message: 'Update password successful!' };
  }

  async verifyPassword(
    verifyPasswordLocalUserRequestDto: VerifyPasswordLocalUserRequestDto,
  ) {
    this.loggerService.log('verifyPassword...');

    const { oldPassword } = verifyPasswordLocalUserRequestDto;

    const { password: dbPassword } =
      await this.localUsersRepository.fetchPasswordById(this.request.user.id);

    const isPasswordValid = await bcrypt.compare(oldPassword, dbPassword);
    if (!isPasswordValid)
      this.errorHandlerServicer.badRequestException(
        'Old Password is incorrect!',
      );

    return true;
  }

  private async hashString(word: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedWord = await bcrypt.hash(word, salt);
    return hashedWord;
  }
}
