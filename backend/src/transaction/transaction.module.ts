import { PrismaProvider } from 'src/providers/prisma.provider';

import { Module } from '@nestjs/common';

import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaProvider],
})
export class TransactionModule {}
