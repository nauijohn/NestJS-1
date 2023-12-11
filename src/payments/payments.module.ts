import { Module } from '@nestjs/common';

import { ProvidersModule } from '../providers/providers.module';
import { UtilsModule } from '../utils/utils.module';
import { PaymentFlightsModule } from './payment-flights/payment-flights.module';
import { PaymentHotelsModule } from './payment-hotels/payment-hotels.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    UtilsModule,
    ProvidersModule,
    PaymentFlightsModule,
    PaymentHotelsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentFlightsModule, PaymentHotelsModule],
})
export class PaymentsModule {}
