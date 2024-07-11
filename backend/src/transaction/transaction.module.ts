import { DatabaseProvider } from 'src/providers/database.provider';

import { Module } from '@nestjs/common';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, DatabaseProvider],
})
export class TransactionModule {}
