import { PayloadDto, TokenDto } from 'src/auth/dto';
import { BankingProvider } from 'src/providers/banking.provider';
import { DatabaseProvider } from 'src/providers/database.provider';
import { OtpDto, OtpProvider } from 'src/providers/otp.provider';
import {
  SendSmsDto,
  SmsProvider,
  SmsTemplate,
} from 'src/providers/sms.provider';
import { ResponseDto } from 'src/utils/response.dto';
import {
  ACCOUNT_DETAILS_IS_RETRIEVED,
  ACCOUNT_IS_RETRIEVED,
  ACCOUNTS_ARE_LINKED,
  ACCOUNTS_ARE_RETRIEVED,
  ACCOUNTS_BALANCES_ARE_RETRIEVED,
  BVN_IS_VERIFIED,
  BVN_NOT_VERIFIED,
  EMAIL_NOT_VERIFIED,
  LINKED_ACCOUNTS_ARE_RETRIEVED,
  OTP_NOT_VALID,
  SMS_IS_SENT,
  TRANSACTIONS_ARE_RETRIEVED,
  USER_NOT_FOUND,
} from 'src/utils/response.types';

import { Injectable } from '@nestjs/common';

import {
  AccountNumberDto,
  accountSummary,
  BvnDto,
  PhoneDto,
  TransactionFilters,
} from './dto/banking.dto';

@Injectable()
export class AccountService {
  constructor(
    private bankingProvider: BankingProvider,
    private databaseProvider: DatabaseProvider,
    private smsProvider: SmsProvider,
    private otpProvider: OtpProvider,
  ) {}

  async sendBvnVerification(user: PayloadDto, bvnDto: BvnDto) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isEmailVerified) {
      return ResponseDto.generateResponse(EMAIL_NOT_VERIFIED);
    }

    const phoneDto: PhoneDto =
      await this.bankingProvider.getPhoneLinkedToBvn(bvnDto);
    const otpDto: OtpDto = await this.otpProvider.generateOtp();
    await this.databaseProvider.user.update({
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
    const foundUser = await this.databaseProvider.user.findUnique({
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

    await this.databaseProvider.user.update({
      where: { id: user.id },
      data: { isBvnVerified: true },
    });

    return ResponseDto.generateResponse(BVN_IS_VERIFIED);
  }

  async getAccountsLinkedToBvn(user: PayloadDto) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isBvnVerified) {
      return ResponseDto.generateResponse(BVN_NOT_VERIFIED);
    }

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const accountsLinkedToBvn =
      await this.bankingProvider.getAccountsLinkedToBvn(bvnDto);

    return ResponseDto.generateResponse(
      LINKED_ACCOUNTS_ARE_RETRIEVED,
      accountsLinkedToBvn,
    );
  }

  async linkAccounts(user: PayloadDto, accountNumbers: AccountNumberDto[]) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const accountsLinkedToBvn =
      await this.bankingProvider.getAccountsLinkedToBvn(bvnDto);

    const accounts = accountsLinkedToBvn
      .filter((account) =>
        accountNumbers.some(({ number }) => number === account.number),
      )
      .map((account) => {
        return {
          ...account,
          userId: user.id,
        };
      });

    await this.databaseProvider.account.createMany({
      data: accounts,
      skipDuplicates: true,
    });

    return ResponseDto.generateResponse(ACCOUNTS_ARE_LINKED);
  }

  async getAccountsBalances(
    user: PayloadDto,
    accountNumbers: AccountNumberDto[],
  ) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const accountsBalances = await this.bankingProvider.getAccountsBalances(
      bvnDto,
      accountNumbers,
    );

    return ResponseDto.generateResponse(
      ACCOUNTS_BALANCES_ARE_RETRIEVED,
      accountsBalances,
    );
  }

  async getAccountsSummary(user: PayloadDto) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const foundAccounts = await this.databaseProvider.account.findMany({
      where: { userId: user.id },
      select: accountSummary,
    });

    return ResponseDto.generateResponse(ACCOUNTS_ARE_RETRIEVED, foundAccounts);
  }

  async getAccountById(user: PayloadDto, index: number) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const foundAccount = await this.databaseProvider.account.findFirst({
      where: { userId: user.id },
      skip: index,
      take: 1,
    });

    return ResponseDto.generateResponse(ACCOUNT_IS_RETRIEVED, foundAccount);
  }

  async getTransactions(
    user: PayloadDto,
    transactionFilters: TransactionFilters,
  ) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const foundAccountNumbers = await this.databaseProvider.account.findMany({
      where: { userId: user.id },
      select: { number: true },
    });

    transactionFilters.accountNumbers =
      transactionFilters.accountNumbers === undefined
        ? foundAccountNumbers
        : transactionFilters.accountNumbers;

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const transactions = await this.bankingProvider.getTransactions(
      bvnDto,
      transactionFilters,
    );

    return ResponseDto.generateResponse(
      TRANSACTIONS_ARE_RETRIEVED,
      transactions,
    );
  }

  async getAccountDetails(
    user: PayloadDto,
    transferAccountNumberDto: AccountNumberDto,
  ) {
    const foundUser = await this.databaseProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const transferAccountDetails = await this.bankingProvider.getAccountDetails(
      transferAccountNumberDto,
    );

    return ResponseDto.generateResponse(
      ACCOUNT_DETAILS_IS_RETRIEVED,
      transferAccountDetails,
    );
  }
}
