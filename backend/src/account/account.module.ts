import { BvnProvider } from 'src/providers/bvn.provider';
import { BankingProvider } from 'src/providers/banking.provider';
import { OtpProvider } from 'src/providers/otp.provider';
import { PrismaProvider } from 'src/providers/prisma.provider';
import { SmsProvider } from 'src/providers/sms.provider';

import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    BankingProvider,
    PrismaProvider,
    OtpProvider,
    SmsProvider,
    BvnProvider,
  ],
})
export class AccountModule {}
