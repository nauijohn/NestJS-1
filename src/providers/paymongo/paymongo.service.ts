import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MyLoggerService } from '../../utils/my-logger.service';
import { PaymongoCheckoutSessionRequestDto } from './dtos/request/paymongo-checkout-session-request.dto';
import { PaymongoCreateWebhookRequestDto } from './dtos/request/paymongo-create-webhook-request.dto';
import { PaymongoConfig } from './paymongo.config';

@Injectable()
export class PaymongoService extends PaymongoConfig {
  private readonly CHECKOUT_SESSION = `${this.BASE_URL}/v1/checkout_sessions`;
  private readonly WEBHOOK = `${this.BASE_URL}/v1/webhooks`;
  private readonly PAYMENTS = `${this.BASE_URL}/v1/payments`;

  constructor(
    private readonly configureService: ConfigService,
    private readonly httpService: HttpService,
    private readonly loggerService: MyLoggerService,
  ) {
    super(configureService);
  }

  async checkoutSession(
    paymongoCheckoutSessionRequestDto: PaymongoCheckoutSessionRequestDto,
  ) {
    this.loggerService.log('checkoutSession...');

    const { data } = await firstValueFrom(
      this.httpService
        .post(
          this.CHECKOUT_SESSION,
          paymongoCheckoutSessionRequestDto,
          this.config,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async createWebhook(
    paymongoCreateWebhookRequestDto: PaymongoCreateWebhookRequestDto,
  ) {
    this.loggerService.log('createWebhook...');

    const { data } = await firstValueFrom(
      this.httpService
        .post(this.WEBHOOK, paymongoCreateWebhookRequestDto, this.config)
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async listAllWebhooks() {
    this.loggerService.log('listAllWebhook...');

    const { data } = await firstValueFrom(
      this.httpService.get(this.WEBHOOK, this.config).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );
    return data;
  }

  async getWebhookById(id: string) {
    this.loggerService.log('getWebhookById...');

    const { data } = await firstValueFrom(
      this.httpService.get(`${this.WEBHOOK}/${id}`, this.config).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );
    return data;
  }

  async disableWebhook(id: string) {
    this.loggerService.log('disableWebhook...');

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.WEBHOOK}/${id}/disable`, {}, this.config)
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async enableWebhook(id: string) {
    this.loggerService.log('enableWebhook...');

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${this.WEBHOOK}/${id}/enable`, {}, this.config)
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    return data;
  }

  async listAllPayments() {
    this.loggerService.log('listAllPayments...');

    const { data } = await firstValueFrom(
      this.httpService.get(this.PAYMENTS, this.config).pipe(
        catchError((error: AxiosError) => {
          throw error;
        }),
      ),
    );
    return data;
  }
}
