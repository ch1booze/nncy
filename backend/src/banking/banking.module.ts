import { BankingProvider } from 'src/providers/banking.provider';
import { OtpProvider } from 'src/providers/otp.provider';
import { DatabaseProvider } from 'src/providers/database.provider';
import { SmsProvider } from 'src/providers/sms.provider';

import { Module } from '@nestjs/common';

import { BankingController } from './banking.controller';
import { AccountService } from './banking.service';

@Module({
  controllers: [BankingController],
  providers: [
    AccountService,
    BankingProvider,
    DatabaseProvider,
    OtpProvider,
    SmsProvider,
  ],
})
export class BankingModule {}
