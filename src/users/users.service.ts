import { Request } from 'express';

import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { SignAs } from '../auth/enums/sign-as.enum';
import { MyLoggerService } from '../utils/my-logger.service';
import { FacebookUsersService } from './facebook-users/facebook-users.service';
import { LocalUsersService } from './local-users/local-users.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
    signAs: string;
  };
}

@Injectable()
export class UsersService {
  constructor(
    @Inject(REQUEST) private readonly request: RequestWithUser,
    private readonly loggerService: MyLoggerService,
    private readonly localUsersService: LocalUsersService,
    private readonly facebookUsersService: FacebookUsersService,
  ) {}

  async getDetails() {
    this.loggerService.log('getDetails...');

    const { id, signAs } = this.request.user;

    if (signAs === SignAs.LocalUser) {
      // const [userDetails, userS3] = await Promise.all([
      //   this.localUsersService.findById(id),
      //   this.localUsersService.fetchFileByKeyFromS3(),
      // ]);
      // const data = await this.localUsersService.fetchFileByKeyFromS3();
      const userProfilePic = await this.localUsersService
        .fetchFileByKeyFromS3()
        .catch((err) => {});

      const profilePic = userProfilePic
        ? `https://galago-assets.s3.ap-southeast-1.amazonaws.com/${this.request.user.id}`
        : null;

      return {
        ...(await this.localUsersService.findById(id)),
        profilePic,
      };
    }

    if (signAs === SignAs.FacebookUser)
      return await this.facebookUsersService.findById(id);
  }
}
