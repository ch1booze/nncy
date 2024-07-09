import { BvnProvider } from 'src/providers/bvn.provider';
import { ObpProvider } from 'src/providers/obp.provider';
import { OtpProvider } from 'src/providers/otp.provider';
import { PrismaProvider } from 'src/providers/prisma.provider';
import { SmsProvider, SmsTemplate } from 'src/providers/sms.provider';
import { ResponseDto } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';

import { AccountDto, VerifyBvnDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    private obpProvider: ObpProvider,
    private prismaProvider: PrismaProvider,
    private smsProvider: SmsProvider,
    private bvnProvider: BvnProvider,
    private otpProvider: OtpProvider,
  ) {}

  async sendBvnVerification(email: string, bvn: string) {
    const isVerifiedBvnResponse =
      await this.bvnProvider.getPhoneLinkedToBvn(bvn);
    if (!isVerifiedBvnResponse.success) {
      isVerifiedBvnResponse.statusCode = HttpStatus.BAD_REQUEST;
      return isVerifiedBvnResponse;
    }
    const phoneLinkedToBvn = isVerifiedBvnResponse.data;

    const { isEmailVerified } = await this.prismaProvider.user.findUnique({
      where: { email },
    });
    if (!isEmailVerified)
      return ResponseDto.error(
        `User's email is not verified.`,
        HttpStatus.BAD_REQUEST,
      );

    const generatedOtpResponse = await this.otpProvider.generateOtp();
    const { secret, token } = generatedOtpResponse.data;
    const updatedUser = await this.prismaProvider.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDto.error(
        "User's secret has not been set.",
        HttpStatus.BAD_REQUEST,
      );

    const sentSmsResponse = await this.smsProvider.sendSms(
      phoneLinkedToBvn,
      token,
      SmsTemplate.Bvn_VERIFICATION,
    );

    if (!sentSmsResponse.success) {
      sentSmsResponse.statusCode = HttpStatus.BAD_REQUEST;
      return sentSmsResponse;
    }

    sentSmsResponse.statusCode = HttpStatus.OK;
    return sentSmsResponse;
  }

  async verifyBvn(email: string, verifyBvnDto: VerifyBvnDto) {
    const existingUserResponse = await this.prismaProvider.user.findUnique({
      where: { email },
    });

    if (!existingUserResponse)
      return ResponseDto.error('User does not exist.', HttpStatus.BAD_REQUEST);

    const { secret } = existingUserResponse;
    const { bvn, otp } = verifyBvnDto;
    const isBvnVerifiedResponse = await this.otpProvider.validateOtp(
      secret,
      otp,
    );

    if (!isBvnVerifiedResponse.success) {
      isBvnVerifiedResponse.statusCode = HttpStatus.BAD_REQUEST;
      return isBvnVerifiedResponse;
    }

    const updatedUser = await this.prismaProvider.user.update({
      where: { email },
      data: { bvn, isBvnVerified: true },
    });

    if (!updatedUser)
      return ResponseDto.error(
        'User was not updated.',
        HttpStatus.EXPECTATION_FAILED,
      );

    return ResponseDto.success(
      `User's Bvn has been updated`,
      null,
      HttpStatus.OK,
    );
  }

  async getAccountsLinkedToUser(id: string) {
    const existingUser = await this.prismaProvider.user.findUnique({
      where: { id },
    });

    const { bvn, isBvnVerified } = existingUser;
    if (!isBvnVerified)
      return ResponseDto.error('Bvn is not verified', HttpStatus.BAD_REQUEST);

    const accountsLinkedToUserResponse =
      await this.obpProvider.getAccountsLinkedToUser(id, bvn);

    accountsLinkedToUserResponse.statusCode = HttpStatus.OK;
    return accountsLinkedToUserResponse;
  }

  async linkAccounts(id: string, accounts: AccountDto[]) {
    accounts.forEach((account) => {
      account.userId = id;
    });

    await this.prismaProvider.account.createMany({
      data: accounts,
      skipDuplicates: true,
    });

    return ResponseDto.success('Linked user accounts.', null, HttpStatus.OK);
  }
}
