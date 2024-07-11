import { PayloadDto, TokenDto } from 'src/auth/dto';
import { BvnProvider, PhoneDto } from 'src/providers/bvn.provider';
import { BankingProvider } from 'src/providers/banking.provider';
import { OtpDto, OtpProvider } from 'src/providers/otp.provider';
import { PrismaProvider } from 'src/providers/prisma.provider';
import {
  SendSmsDto,
  SmsProvider,
  SmsTemplate,
} from 'src/providers/sms.provider';
import { ResponseDto } from 'src/utils/response.dto';
import {
  ACCOUNT_IS_RETRIEVED,
  ACCOUNTS_ARE_LINKED,
  ACCOUNTS_ARE_RETRIEVED,
  BVN_IS_VERIFIED,
  BVN_NOT_VERIFIED,
  EMAIL_NOT_VERIFIED,
  LINKED_ACCOUNTS_ARE_RETRIEVED,
  OTP_NOT_VALID,
  SMS_IS_SENT,
  USER_NOT_FOUND,
} from 'src/utils/response.types';

import { Injectable } from '@nestjs/common';

import { AccountDto, accountSummary, BvnDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    private bankingProvider: BankingProvider,
    private prismaProvider: PrismaProvider,
    private smsProvider: SmsProvider,
    private bvnProvider: BvnProvider,
    private otpProvider: OtpProvider,
  ) {}

  async sendBvnVerification(user: PayloadDto, bvnDto: BvnDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isEmailVerified) {
      return ResponseDto.generateResponse(EMAIL_NOT_VERIFIED);
    }

    const phoneDto: PhoneDto =
      await this.bvnProvider.getPhoneLinkedToBvn(bvnDto);
    const otpDto: OtpDto = await this.otpProvider.generateOtp();
    await this.prismaProvider.user.update({
      where: { id: user.id },
      data: { secret: otpDto.secret },
    });

    const sendSmsDto: SendSmsDto = {
      name: `${foundUser.firstName} ${foundUser.lastName}`,
      phone: phoneDto.phone,
      token: otpDto.token,
      smsTemplate: SmsTemplate.BVN_VERIFICATION,
    };
    const sentSms = await this.smsProvider.sendSms(sendSmsDto);

    return ResponseDto.generateResponse(SMS_IS_SENT, sentSms);
  }

  async verifyBvn(user: PayloadDto, tokenDto: TokenDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const otpDto: OtpDto = {
      secret: foundUser.secret,
      token: tokenDto.token,
    };
    const isValidatedOtp = await this.otpProvider.validateOtp(otpDto);
    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OTP_NOT_VALID);
    }

    await this.prismaProvider.user.update({
      where: { id: user.id },
      data: { isBvnVerified: true },
    });

    return ResponseDto.generateResponse(BVN_IS_VERIFIED);
  }

  async getAccountsLinkedToUser(user: PayloadDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isBvnVerified) {
      return ResponseDto.generateResponse(BVN_NOT_VERIFIED);
    }

    const accountsLinkedToUser =
      await this.bankingProvider.getAccountsLinkedToUser(
        user.id,
        foundUser.bvn,
      );

    return ResponseDto.generateResponse(
      LINKED_ACCOUNTS_ARE_RETRIEVED,
      accountsLinkedToUser,
    );
  }

  async linkAccounts(user: PayloadDto, accounts: AccountDto[]) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    await this.prismaProvider.account.createMany({
      data: accounts,
      skipDuplicates: true,
    });

    return ResponseDto.generateResponse(ACCOUNTS_ARE_LINKED);
  }

  async getAccountsSummary(user: PayloadDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const foundAccounts = await this.prismaProvider.account.findMany({
      where: { userId: user.id },
      select: accountSummary,
    });

    return ResponseDto.generateResponse(ACCOUNTS_ARE_RETRIEVED, foundAccounts);
  }

  async getAccountById(user: PayloadDto, index: number) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const foundAccount = await this.prismaProvider.account.findFirst({
      where: { userId: user.id },
      skip: index,
      take: 1,
    });

    return ResponseDto.generateResponse(ACCOUNT_IS_RETRIEVED, foundAccount);
  }
}
