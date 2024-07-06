import { BVNProvider } from 'src/providers/bvn.provider';
import { OBPProvider } from 'src/providers/obp.provider';
import { OTPProvider } from 'src/providers/otp.provider';
import { PrismaService } from 'src/providers/prisma.service';
import { SMSProvider, SMSTemplate } from 'src/providers/sms.provider';
import { ResponseDTO } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';

import { AccountDTO, VerifyBVNDTO } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    private obpProvider: OBPProvider,
    private prismaService: PrismaService,
    private smsProvider: SMSProvider,
    private bvnProvider: BVNProvider,
    private otpProvider: OTPProvider,
  ) {}

  async sendBVNVerification(email: string, bvn: string) {
    const isVerifiedBVNResponse =
      await this.bvnProvider.getPhoneLinkedToBVN(bvn);
    if (!isVerifiedBVNResponse.success) {
      isVerifiedBVNResponse.statusCode = HttpStatus.BAD_REQUEST;
      return isVerifiedBVNResponse;
    }
    const phoneLinkedToBVN = isVerifiedBVNResponse.data;

    const { isEmailVerified } = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!isEmailVerified)
      return ResponseDTO.error(
        `User's email is not verified.`,
        HttpStatus.BAD_REQUEST,
      );

    const generatedOTPResponse = await this.otpProvider.generateOTP();
    const { secret, token } = generatedOTPResponse.data;
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDTO.error(
        "User's secret has not been set.",
        HttpStatus.BAD_REQUEST,
      );

    const sentSMSResponse = await this.smsProvider.sendSMS(
      phoneLinkedToBVN,
      token,
      SMSTemplate.BVN_VERIFICATION,
    );

    if (!sentSMSResponse.success) {
      sentSMSResponse.statusCode = HttpStatus.BAD_REQUEST;
      return sentSMSResponse;
    }

    sentSMSResponse.statusCode = HttpStatus.OK;
    return sentSMSResponse;
  }

  async verifyBVN(email: string, verifyBVNDTO: VerifyBVNDTO) {
    const existingUserResponse = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUserResponse)
      return ResponseDTO.error('User does not exist.', HttpStatus.BAD_REQUEST);

    const { secret } = existingUserResponse;
    const { bvn, otp } = verifyBVNDTO;
    const isBVNVerifiedResponse = await this.otpProvider.validateOTP(
      secret,
      otp,
    );

    if (!isBVNVerifiedResponse.success) {
      isBVNVerifiedResponse.statusCode = HttpStatus.BAD_REQUEST;
      return isBVNVerifiedResponse;
    }

    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: { bvn, isBVNVerified: true },
    });

    if (!updatedUser)
      return ResponseDTO.error(
        'User was not updated.',
        HttpStatus.EXPECTATION_FAILED,
      );

    return ResponseDTO.success(
      `User's BVN has been updated`,
      null,
      HttpStatus.OK,
    );
  }

  async getAccountsLinkedToUser(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    const { bvn, isBVNVerified } = existingUser;
    if (!isBVNVerified)
      return ResponseDTO.error('BVN is not verified', HttpStatus.BAD_REQUEST);

    const accountsLinkedToUserResponse =
      await this.obpProvider.getAccountsLinkedToUser(bvn);

    accountsLinkedToUserResponse.statusCode = HttpStatus.OK;
    return accountsLinkedToUserResponse;
  }

  async linkAccounts(id: string, accounts: AccountDTO[]) {
    accounts.forEach((account) => {
      account.userId = id;
    });

    await this.prismaService.account.createMany({
      data: accounts,
      skipDuplicates: true,
    });

    return ResponseDTO.success('Linked user accounts.', null, HttpStatus.OK);
  }
}
