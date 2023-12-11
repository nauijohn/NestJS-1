import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from '../../utils/utils.module';
import { TransactionHotelsMapperProfile } from './automapper/transaction-hotels-mapper.profile';
import { TransactionHotel } from './transaction-hotel.entity';
import { TransactionHotelsController } from './transaction-hotels.controller';
import { TransactionHotelsRepository } from './transaction-hotels.repository';
import { TransactionHotelsService } from './transaction-hotels.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionHotel]), UtilsModule],
  controllers: [TransactionHotelsController],
  providers: [
    TransactionHotelsService,
    TransactionHotelsRepository,
    TransactionHotelsMapperProfile,
  ],
  exports: [TransactionHotelsService],
})
export class TransactionHotelsModule {}
