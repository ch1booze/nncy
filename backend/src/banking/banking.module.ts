import { MessagingModule } from 'src/messaging/messaging.module';
import { ObpModule } from 'src/obp/obp.module';
import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { BankingController } from './banking.controller';
import { BankingService } from './banking.service';

@Module({
  imports: [DatabaseModule, MessagingModule, ObpModule],
  controllers: [BankingController],
  providers: [BankingService],
})
export class BankingModule {}
