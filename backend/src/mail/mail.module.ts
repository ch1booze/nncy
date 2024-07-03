import { OtpService } from 'src/otp/otp.service';
import { PrismaModule } from 'src/prisma/prisma.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [MailService, OtpService],
  exports: [MailService],
})
export class MailModule {}
