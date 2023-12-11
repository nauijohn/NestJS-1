import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MyLoggerService } from '../utils/my-logger.service';
import { PaymentCheckoutSessionRequestDto } from './dtos/request/payment-checkout-session-request.dto';
import { PaymentsService } from './payments.service';

@Controller()
@ApiTags('Payments')
export class PaymentsController {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('checkout-session')
  async checkoutSession(
    @Body()
    paymentCheckoutSessionRequestDto: PaymentCheckoutSessionRequestDto,
  ) {
    this.loggerService.log('checkoutSession');
    return {
      statusCode: HttpStatus.OK,
      data: await this.paymentsService.checkoutSession(
        paymentCheckoutSessionRequestDto,
      ),
    };
  }
}
