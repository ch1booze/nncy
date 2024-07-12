import { BankingProvider } from 'src/providers/banking.provider';
import { OtpProvider } from 'src/providers/otp.provider';
import { DatabaseProvider } from 'src/providers/database.provider';
import { SmsProvider } from 'src/providers/sms.provider';

import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    BankingProvider,
    DatabaseProvider,
    OtpProvider,
    SmsProvider,
  ],
})
export class AccountModule {}
