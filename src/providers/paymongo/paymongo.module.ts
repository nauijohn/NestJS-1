import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { UtilsModule } from '../../utils/utils.module';
import { PaymongoController } from './paymongo.controller';
import { PaymongoService } from './paymongo.service';

@Module({
  imports: [HttpModule, UtilsModule],
  controllers: [PaymongoController],
  providers: [PaymongoService],
  exports: [PaymongoService],
})
export class PaymongoModule {}
