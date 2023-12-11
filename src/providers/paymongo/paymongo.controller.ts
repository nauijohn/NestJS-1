import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../../utils/my-logger.service';
import { PaymongoCheckoutSessionRequestDto } from './dtos/request/paymongo-checkout-session-request.dto';
import { PaymongoCreateWebhookRequestDto } from './dtos/request/paymongo-create-webhook-request.dto';
import { PaymongoService } from './paymongo.service';

@Controller()
@ApiTags('paymongo')
export class PaymongoController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly paymongoService: PaymongoService,
  ) {}

  @Post('checkout-session')
  async checkoutSession(
    @Body()
    paymongoCheckoutSessionRequestDto: PaymongoCheckoutSessionRequestDto,
  ) {
    this.loggerService.log('checkoutSession...');

    return await this.paymongoService.checkoutSession(
      paymongoCheckoutSessionRequestDto,
    );
  }

  @Get('webhook')
  async listAllWebhooks() {
    this.loggerService.log('listAllWebhooks...');

    return await this.paymongoService.listAllWebhooks();
  }

  @Get('webhook/:id')
  async getWebhookById(@Param('id') id: string) {
    this.loggerService.log('getWebhookById...');

    return await this.paymongoService.getWebhookById(id);
  }

  @Post('webhook')
  async createWebhook(
    @Body() paymongoCreateWebhookRequestDto: PaymongoCreateWebhookRequestDto,
  ) {
    this.loggerService.log('createWebhook...');

    return await this.paymongoService.createWebhook(
      paymongoCreateWebhookRequestDto,
    );
  }

  @Post('webhook/:id/disable')
  async disableWebhook(@Param('id') id: string) {
    this.loggerService.log('disableWebhook...');

    return await this.paymongoService.disableWebhook(id);
  }

  @Post('webhook/:id/enable')
  async enableWebhook(@Param('id') id: string) {
    this.loggerService.log('enableWebhook...');

    return await this.paymongoService.enableWebhook(id);
  }

  @Get('payments')
  async listAllPayments() {
    this.loggerService.log('listAllPayments...');

    return await this.paymongoService.listAllPayments();
  }
}
