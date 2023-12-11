import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ProvidersModule } from '../providers/providers.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    JwtModule.register({}),
    UsersModule,
    UserRolesModule,
    RefreshTokensModule,
    UtilsModule,
    ProvidersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    FacebookStrategy,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
