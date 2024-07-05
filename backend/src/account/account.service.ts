import { OBPProvider } from 'src/providers/obp.provider';
import { PrismaService } from 'src/providers/prisma.service';

import { HttpStatus, Injectable } from '@nestjs/common';

import { AccountDTO } from './dto/account.dto';
import { ResponseDTO } from 'src/utils/response.dto';
import { SMSProvider, SMSTemplate } from 'src/providers/sms.provider';
import { BVNProvider } from 'src/providers/bvn.provider';
import { OTPProvider } from 'src/providers/otp.provider';

@Injectable()
export class AccountService {
  constructor(
    private obpProvider: OBPProvider,
    private prismaService: PrismaService,
    private smsProvider: SMSProvider,
    private bvnProvider: BVNProvider,
    private otpProvider: OTPProvider,
  ) {}

  async verifyBVN(email: string, bvn: string) {
    const isVerifiedBVNResponse =
      await this.bvnProvider.getPhoneLinkedToBVN(bvn);
    if (!isVerifiedBVNResponse.success) {
      isVerifiedBVNResponse.statusCode = HttpStatus.BAD_REQUEST;
      return isVerifiedBVNResponse;
    }
    const phoneLinkedToBVN = isVerifiedBVNResponse.data;

    let isVerified, firstName, lastName;
    await this.prismaService.user.findUnique({
      where: { email },
      select: { isVerified, firstName, lastName },
    });
    if (!isVerified) return ResponseDTO.error(`User's email is not verified.`);

    const generatedOTPResponse = await this.otpProvider.generateOTP();
    const { secret, token } = generatedOTPResponse.data;
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDTO.error("User's secret has not been set.");

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

  async getAccountsLinkedToUser(bvn: string) {
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
