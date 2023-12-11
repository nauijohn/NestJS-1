import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../utils/utils.module';
import { IataCodesMapperProfile } from './automapper/iata-codes-mapper.profile';
import { IataCode } from './iata-code.entity';
import { IataCodesController } from './iata-codes.controller';
import { IataCodesRepository } from './iata-codes.repository';
import { IataCodesService } from './iata-codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([IataCode]), UtilsModule],
  controllers: [IataCodesController],
  providers: [IataCodesService, IataCodesRepository, IataCodesMapperProfile],
  exports: [IataCodesService],
})
export class IataCodesModule {}
