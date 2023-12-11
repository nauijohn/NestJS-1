import { Module } from '@nestjs/common';

import { TransactionFlightsModule } from './flights/transaction-flights.module';
import { TransactionHotelsModule } from './hotels/transaction-hotels.module';

@Module({
  imports: [TransactionHotelsModule, TransactionFlightsModule],
  exports: [TransactionHotelsModule, TransactionFlightsModule],
})
export class TransactionsModule {}
