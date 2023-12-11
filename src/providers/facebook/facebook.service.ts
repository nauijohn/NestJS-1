import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_REDIRECT_URL,
} from '../../config/config.constant';
import { MyLoggerService } from '../../utils/my-logger.service';

@Injectable()
export class FacebookService {
  constructor(
    private readonly configureService: ConfigService,
    private readonly loggerService: MyLoggerService,
    private readonly httpService: HttpService,
  ) {}

  async getAccessToken(code: string) {
    const clientId = this.configureService.get(FACEBOOK_CLIENT_ID);
    const redirectUri = this.configureService.get(FACEBOOK_REDIRECT_URL);
    const clientSecret = this.configureService.get(FACEBOOK_CLIENT_SECRET);
    const url: string = `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`;
    const { data } = await firstValueFrom(
      this.httpService
        .get(url, {
          headers: {
            Accept: 'text/plain',
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async decodeAccessToken(accessToken: string) {
    const url: string = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`;
    const { data } = await firstValueFrom(
      this.httpService
        .get(url, {
          headers: {
            Accept: 'text/plain',
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }
}
