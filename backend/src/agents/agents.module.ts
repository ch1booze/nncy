import { AccountService } from 'src/account/account.service';
import { TransactionService } from 'src/transaction/transaction.service';

import { Module } from '@nestjs/common';

import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, AccountService, TransactionService],
})
export class AgentsModule {}
