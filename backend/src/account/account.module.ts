import { BVNProvider } from 'src/providers/bvn.provider';
import { OBPProvider } from 'src/providers/obp.provider';
import { OTPProvider } from 'src/providers/otp.provider';
import { PrismaService } from 'src/providers/prisma.service';
import { SMSProvider } from 'src/providers/sms.provider';

import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [
    AccountService,
    OBPProvider,
    PrismaService,
    OTPProvider,
    SMSProvider,
    BVNProvider,
  ],
})
export class AccountModule {}
