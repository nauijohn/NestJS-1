import { HotelsModule } from 'src/hotels/hotels.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingFlightsModule } from '../bookings/booking-flights/booking-flights.module';
import { FlightsModule } from '../flights/flights.module';
import { NestMailerModule } from '../nest-mailer/nest-mailer.module';
import { PaymentsModule } from '../payments/payments.module';
import { MystiflyFlightBookResponsesModule } from '../providers/mystifly/flight-book-responses/mystifly-flight-book-responses.module';
import { MystiflyFlightRevalidationResponsesModule } from '../providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-responses.module';
import { MystiflyFlightUtilsModule } from '../providers/mystifly/flight-utils/mystifly-flight-utils.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UtilsModule } from '../utils/utils.module';
import { PaymongoEventMapperProfile } from './automapper/paymongo-event-mapper.profile';
import { PaymongoEvent, PaymongoEventSchema } from './paymongo-event.schema';
import { PaymongoEventsController } from './paymongo-events.controller';
import { PaymongoEventsRepository } from './paymongo-events.repository';
import { PaymongoEventsService } from './paymongo-events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymongoEvent.name,
        schema: PaymongoEventSchema,
      },
    ]),
    UtilsModule,
    PaymentsModule,
    MystiflyFlightRevalidationResponsesModule,
    MystiflyFlightBookResponsesModule,
    MystiflyFlightUtilsModule,
    BookingFlightsModule,
    TransactionsModule,
    FlightsModule,
    HotelsModule,
    NestMailerModule,
  ],
  controllers: [PaymongoEventsController],
  providers: [
    PaymongoEventsService,
    PaymongoEventsRepository,
    PaymongoEventMapperProfile,
  ],
  exports: [PaymongoEventsService],
})
export class PaymongoEventsModule {}
