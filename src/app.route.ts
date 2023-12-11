import { AwsModule } from './aws/aws.module';
import { AwsS3Module } from './aws/s3/aws-s3.module';
import { BookingFlightsModule } from './bookings/booking-flights/booking-flights.module';
import { BookingHotelsModule } from './bookings/booking-hotels/booking-hotels.module';
import { BookingsModule } from './bookings/bookings.module';
import { CustomerDetailsModule } from './customer-details/customer-details.module';
import { CustomerFlightDetailsModule } from './customer-details/flights/customer-flight-details.module';
import { CustomerHotelDetailsModule } from './customer-details/hotels/customer-hotel-details.module';
import { FlightsModule } from './flights/flights.module';
import { OneWayModule } from './flights/one-way/one-way.module';
import { PassengerDetailsModule } from './flights/passenger-details/passenger-details.module';
import { RoundtripModule } from './flights/roundtrip/roundtrip.module';
import { TravelerDetailsModule } from './flights/traveler-details/traveler-details.module';
import { PaymentFlightsModule } from './payments/payment-flights/payment-flights.module';
import { PaymentHotelsModule } from './payments/payment-hotels/payment-hotels.module';
import { PaymentsModule } from './payments/payments.module';
import { PrebookingFlightsModule } from './prebookings/prebooking-flights/prebooking-flights.module';
import { PrebookingHotelsModule } from './prebookings/prebooking-hotels/prebooking-hotels.module';
import { PrebookingsModule } from './prebookings/prebookings.module';
import { PricingFlightsModule } from './pricings/flights/pricing-flights.module';
import { PricingHotelsModule } from './pricings/hotels/pricing-hotels.module';
import { PricingsModule } from './pricings/pricings.module';
import { AggregatesModule } from './providers/aggregates/aggregates.module';
import { AmadeusModule } from './providers/amadeus/amadeus.module';
import { AmadeusFlightsModule } from './providers/amadeus/flights/amadeus-flights.module';
import { FacebookModule } from './providers/facebook/facebook.module';
import { MystiflyFlightDetailsModule } from './providers/mystifly/flight-details/mystifly-flight-details.module';
import { MystiflyFlightFareRulesResponsesModule } from './providers/mystifly/flight-fare-rules-responses/mystifly-flight-fare-rules-responses.module';
import { MystiflyFlightRevalidationResponsesModule } from './providers/mystifly/flight-revalidation-responses/mystifly-flight-revalidation-responses.module';
import { MystiflyFlightUtilsModule } from './providers/mystifly/flight-utils/mystifly-flight-utils.module';
import { MystiflyModule } from './providers/mystifly/mystifly.module';
import { PaymongoModule } from './providers/paymongo/paymongo.module';
import { ProvidersModule } from './providers/providers.module';
import { TboHotelBookResponsesModule } from './providers/tbo/hotel-book-responses/tbo-hotel-book-responses.module';
import { TboHotelDetailsModule } from './providers/tbo/hotel-details/tbo-hotel-details.module';
import { TboHotelPrebookResponsesModule } from './providers/tbo/hotel-prebook-responses/tbo-hotel-prebook-responses.module';
import { TboHotelsModule } from './providers/tbo/hotel-utils/hotels/tbo-hotels.module';
import { TboHotelUtilsModule } from './providers/tbo/hotel-utils/tbo-hotel-utils.module';
import { TboModule } from './providers/tbo/tbo.module';
import { TripninjaFlightsModule } from './providers/tripninja/flights/tripninja-flights.module';
import { TripninjaModule } from './providers/tripninja/tripninja.module';
import { TransactionFlightsModule } from './transactions/flights/transaction-flights.module';
import { TransactionHotelsModule } from './transactions/hotels/transaction-hotels.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FacebookUsersModule } from './users/facebook-users/facebook-users.module';
import { LocalUsersModule } from './users/local-users/local-users.module';
import { UsersModule } from './users/users.module';

export const routes = [
  {
    path: 'aws',
    module: AwsModule,
    children: [
      {
        path: 's3',
        module: AwsS3Module,
      },
    ],
  },
  {
    path: 'providers',
    module: ProvidersModule,
    children: [
      {
        path: 'mystifly',
        module: MystiflyModule,
        children: [
          {
            path: 'flight-details',
            module: MystiflyFlightDetailsModule,
          },
          {
            path: 'flight-utils',
            module: MystiflyFlightUtilsModule,
          },
          {
            path: 'flight-fare-rules-responses',
            module: MystiflyFlightFareRulesResponsesModule,
          },
          {
            path: 'flight-revalidation-responses',
            module: MystiflyFlightRevalidationResponsesModule,
          },
        ],
      },
      {
        path: 'tbo',
        module: TboModule,
        children: [
          {
            path: 'utils',
            module: TboHotelUtilsModule,
            children: [
              {
                path: 'hotels',
                module: TboHotelsModule,
              },
            ],
          },
          {
            path: 'hotel-details',
            module: TboHotelDetailsModule,
          },
          {
            path: 'hotel-prebook-responses',
            module: TboHotelPrebookResponsesModule,
          },
          {
            path: 'hotel-book-responses',
            module: TboHotelBookResponsesModule,
          },
        ],
      },
      {
        path: 'amadeus',
        module: AmadeusModule,
        children: [{ path: 'flights', module: AmadeusFlightsModule }],
      },
      {
        path: 'aggregates',
        module: AggregatesModule,
      },
      {
        path: 'tripninja',
        module: TripninjaModule,
        children: [{ path: 'flights', module: TripninjaFlightsModule }],
      },
      {
        path: 'paymongo',
        module: PaymongoModule,
      },
      {
        path: 'facebook',
        module: FacebookModule,
      },
    ],
  },
  {
    path: 'flights',
    module: FlightsModule,
    children: [
      { path: 'one-way', module: OneWayModule },
      { path: 'roundtrip', module: RoundtripModule },
      { path: 'traveler-details', module: TravelerDetailsModule },
      { path: 'passenger-details', module: PassengerDetailsModule },
    ],
  },
  {
    path: 'users',
    module: UsersModule,
    children: [
      {
        path: 'facebook',
        module: FacebookUsersModule,
      },
      {
        path: 'local',
        module: LocalUsersModule,
      },
    ],
  },
  {
    path: 'payments',
    module: PaymentsModule,
    children: [
      {
        path: 'flights',
        module: PaymentFlightsModule,
      },
      {
        path: 'hotels',
        module: PaymentHotelsModule,
      },
    ],
  },
  {
    path: 'prebookings',
    module: PrebookingsModule,
    children: [
      {
        path: 'flights',
        module: PrebookingFlightsModule,
      },
      {
        path: 'hotels',
        module: PrebookingHotelsModule,
      },
    ],
  },
  {
    path: 'bookings',
    module: BookingsModule,
    children: [
      {
        path: 'flights',
        module: BookingFlightsModule,
      },
      {
        path: 'hotels',
        module: BookingHotelsModule,
      },
    ],
  },
  {
    path: 'transactions',
    module: TransactionsModule,
    children: [
      {
        path: 'flights',
        module: TransactionFlightsModule,
      },
      {
        path: 'hotels',
        module: TransactionHotelsModule,
      },
    ],
  },
  {
    path: 'pricings',
    module: PricingsModule,
    children: [
      {
        path: 'flights',
        module: PricingFlightsModule,
      },
      {
        path: 'hotels',
        module: PricingHotelsModule,
      },
    ],
  },
  {
    path: 'customer-details',
    module: CustomerDetailsModule,
    children: [
      {
        path: 'flights',
        module: CustomerFlightDetailsModule,
      },
      {
        path: 'hotels',
        module: CustomerHotelDetailsModule,
      },
    ],
  },
];
