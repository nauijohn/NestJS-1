import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UtilsModule } from '../utils/utils.module';
import { RefreshTokenMapperProfile } from './automapper/refresh-token-mapper.profile';
import { RefreshToken, RefreshTokenSchema } from './refresh-token.schema';
import { RefreshTokenController } from './refresh-tokens.controller';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    UtilsModule,
  ],
  providers: [
    RefreshTokensService,
    RefreshTokensRepository,
    RefreshTokenMapperProfile,
  ],
  exports: [RefreshTokensService],
  controllers: [RefreshTokenController],
})
export class RefreshTokensModule {}
