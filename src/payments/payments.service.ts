import { Injectable } from '@nestjs/common';

import { PaymongoCheckoutSessionRequestDto } from '../providers/paymongo/dtos/request/paymongo-checkout-session-request.dto';
import { PaymongoService } from '../providers/paymongo/paymongo.service';
import { MyLoggerService } from '../utils/my-logger.service';
import { PaymentCheckoutSessionRequestDto } from './dtos/request/payment-checkout-session-request.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly loggerService: MyLoggerService,
    private readonly paymongoService: PaymongoService,
  ) {}

  async checkoutSession(
    paymentCheckoutSessionRequestDto: PaymentCheckoutSessionRequestDto,
  ) {
    this.loggerService.log('checkoutSession...');

    const { description, line_items } = paymentCheckoutSessionRequestDto;

    const paymentReference = new Date().getTime().toString();

    const paymongoCheckoutSessionRequestDto: PaymongoCheckoutSessionRequestDto =
      {
        data: {
          attributes: {
            billing: null,
            cancel_url: null,
            description,
            line_items,
            payment_method_types: [
              'card',
              'dob',
              'dob_ubp',
              'gcash',
              'grab_pay',
              'paymaya',
            ],
            reference_number: paymentReference,
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            success_url: `https://webdev.galago.com.ph/payment-confirmation?paymentReference=${paymentReference}`,
            statement_descriptor: 'test',
          },
        },
      };

    return (
      await this.paymongoService.checkoutSession(
        paymongoCheckoutSessionRequestDto,
      )
    ).data;
  }
}
