import { MessagingModule } from 'src/messaging/messaging.module';
import { ObpModule } from 'src/obp/obp.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';

import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';

@Module({
  imports: [PrismaModule, MessagingModule, ObpModule],
  controllers: [BankingController],
  providers: [BankingService],
})
export class BankingModule {}
