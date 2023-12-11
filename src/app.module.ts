import { AutomapperModule } from '@automapper/nestjs';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from './ability/ability.module';
import { routes } from './app.route';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { AwsModule } from './aws/aws.module';
import { BookingsModule } from './bookings/bookings.module';
import { automapperConfig } from './config/automapper.config';
import { cacheConfig } from './config/cache.config';
import { config } from './config/config';
import { mailerConfig } from './config/mailer.config';
import { mongooseConfig } from './config/mongoose.config';
import { typeormConfig } from './config/typeorm.config';
import { CredentialsModule } from './credentials/credentials.module';
import { CustomerDetailsModule } from './customer-details/customer-details.module';
import { FlightsModule } from './flights/flights.module';
import { HotelsModule } from './hotels/hotels.module';
import { IataCodesModule } from './iataCodes/iata-codes.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RequestIdMiddleware } from './middlewares/request-id.middleware';
import { NestMailerModule } from './nest-mailer/nest-mailer.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymongoEventsModule } from './paymongo-events/paymongo-events.module';
import { PrebookingsModule } from './prebookings/prebookings.module';
import { PricingsModule } from './pricings/pricings.module';
import { ProvidersModule } from './providers/providers.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { TestModule } from './test/test.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot(config),
    MailerModule.forRootAsync(mailerConfig),
    MongooseModule.forRootAsync(mongooseConfig),
    TypeOrmModule.forRootAsync(typeormConfig),
    CacheModule.registerAsync(cacheConfig),
    AutomapperModule.forRoot(automapperConfig),
    AuthModule,
    UsersModule,
    RefreshTokensModule,
    TestModule,
    UserRolesModule,
    FlightsModule,
    UtilsModule,
    AbilityModule,
    HotelsModule,
    ProvidersModule,
    PaymongoEventsModule,
    PaymentsModule,
    AwsModule,
    BookingsModule,
    TransactionsModule,
    PricingsModule,
    IataCodesModule,
    CustomerDetailsModule,
    NestMailerModule,
    CredentialsModule,
    PrebookingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AbilitiesGuard,
    // }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
