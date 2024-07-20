import { greaterThanOrEqual, subtract, toDecimal } from 'dinero.js';
import { DatabaseService } from 'src/database/database.service';
import { MessagingService } from 'src/messaging/messaging.service';
import {
  MessageDto,
  OtpDto,
  Template,
} from 'src/messaging/payload/messaging.dto';
import { OtpNotValid } from 'src/messaging/payload/messaging.response';
import { ObpService } from 'src/obp/obp.service';
import { ResponseDto } from 'src/response/response.dto';
import { TokenDto, UserDto } from 'src/user/payload/user.dto';
import { EmailNotVerified } from 'src/user/payload/user.response';

import { Injectable } from '@nestjs/common';

import {
  AccountNumberDto,
  BvnDto,
  PhoneDto,
  TransactionFilterDto,
  TransferFundsDto,
} from './payload/banking.dto';
import {
  AccountDetailsIsRetrieved,
  AccountIsRetrieved,
  AccountsAreLinked,
  AccountsBalancesAreRetrieved,
  AccountsSummaryAreRetrieved,
  BvnIsVerified,
  BvnNotVerified,
  InsufficientFunds,
  LinkedAccountsAreRetrieved,
  NoLinkedAccounts,
  TransactionsAreRetrieved,
} from './payload/banking.response';

@Injectable()
export class BankingService {
  constructor(
    private databaseService: DatabaseService,
    private messagingService: MessagingService,
    private obpService: ObpService,
  ) {}

  async sendBvnVerification(user: UserDto, bvnDto: BvnDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isEmailVerified) {
      return ResponseDto.generateResponse(EmailNotVerified);
    }

    const phoneDto: PhoneDto =
      await this.obpService.getPhoneLinkedToBvn(bvnDto);
    const otpDto: OtpDto = await this.messagingService.generateOtp();
    await this.databaseService.user.update({
      where: { id: user.id },
      data: { secret: otpDto.secret },
    });

    const sendSmsDto: MessageDto = {
      name: `${foundUser.firstName} ${foundUser.lastName}`,
      token: otpDto.token,
      template: Template.BVN_VERIFICATION,
      contact: phoneDto.phone,
    };

    return await this.messagingService.sendSms(sendSmsDto);
  }

  async verifyBvn(user: UserDto, tokenDto: TokenDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });

    const otpDto: OtpDto = {
      secret: foundUser.secret,
      token: tokenDto.token,
    };
    const isValidatedOtp = await this.messagingService.validateOtp(otpDto);
    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OtpNotValid);
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { isBvnVerified: true },
    });

    return ResponseDto.generateResponse(BvnIsVerified);
  }

  async getAccountsLinkedToBvn(user: UserDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isBvnVerified) {
      return ResponseDto.generateResponse(BvnNotVerified);
    }

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const accountsLinkedToBvn =
      await this.obpService.getAccountsLinkedToBvn(bvnDto);

    return ResponseDto.generateResponse(
      LinkedAccountsAreRetrieved,
      accountsLinkedToBvn,
    );
  }

  async linkAccounts(user: UserDto, accountNumbers: AccountNumberDto[]) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const accountsLinkedToBvn =
      await this.obpService.getAccountsLinkedToBvn(bvnDto);

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

    await this.databaseService.account.createMany({
      data: accounts,
      skipDuplicates: true,
    });

    return ResponseDto.generateResponse(AccountsAreLinked);
  }

  async getAccountsBalances(
    user: UserDto,
    accountNumberDtos: AccountNumberDto[],
  ) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isBvnVerified) {
      return ResponseDto.generateResponse(BvnNotVerified);
    }

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const accountsBalancesList = [];
    for (const accountNumberDto of accountNumberDtos) {
      accountsBalancesList.push(
        this.obpService.getAccountBalance(bvnDto, accountNumberDto),
      );
    }

    const accountsBalances = await Promise.all(accountsBalancesList);
    return ResponseDto.generateResponse(
      AccountsBalancesAreRetrieved,
      accountsBalances,
    );
  }

  async getAccountsSummary(user: UserDto) {
    const AccountSummarySelectList = ['bankName', 'number', 'currencyCode'];
    const AccountSummarySelectFields =
      await this.databaseService.getSelectFields(AccountSummarySelectList);
    const foundAccounts = await this.databaseService.account.findMany({
      where: { userId: user.id },
      select: AccountSummarySelectFields,
    });

    return ResponseDto.generateResponse(
      AccountsSummaryAreRetrieved,
      foundAccounts,
    );
  }

  async getAccountById(user: UserDto, index: number) {
    const foundAccount = await this.databaseService.account.findFirst({
      where: { userId: user.id },
      skip: index,
      take: 1,
    });

    return ResponseDto.generateResponse(AccountIsRetrieved, foundAccount);
  }

  async getTransactions(
    user: UserDto,
    TransactionFilterDto: TransactionFilterDto,
  ) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser.isBvnVerified) {
      return ResponseDto.generateResponse(BvnNotVerified);
    }

    const foundAccountNumbers = await this.databaseService.account.findMany({
      where: { userId: user.id },
      select: { number: true },
    });

    if (!foundAccountNumbers) {
      return ResponseDto.generateResponse(NoLinkedAccounts);
    }

    const accountNumbers: string[] = [];
    for (const account of foundAccountNumbers) {
      accountNumbers.push(account.number);
    }

    TransactionFilterDto.accountNumbers =
      TransactionFilterDto.accountNumbers === undefined
        ? accountNumbers
        : TransactionFilterDto.accountNumbers;

    const bvnDto: BvnDto = { bvn: foundUser.bvn };
    const transactions = await this.obpService.getTransactions(
      bvnDto,
      TransactionFilterDto,
    );

    return ResponseDto.generateResponse(TransactionsAreRetrieved, transactions);
  }

  async getAccountDetails(transferAccountNumberDto: AccountNumberDto) {
    const transferAccountDetails = await this.obpService.getAccountDetails(
      transferAccountNumberDto,
    );

    return ResponseDto.generateResponse(
      AccountDetailsIsRetrieved,
      transferAccountDetails,
    );
  }

  async transferFunds(user: UserDto, transferFundsDto: TransferFundsDto) {
    const bvnDto: BvnDto = await this.databaseService.user.findUnique({
      where: { id: user.id },
      select: { bvn: true },
    });
    const primaryAccountNumberDto: AccountNumberDto = {
      number: transferFundsDto.primaryAccountNumber,
    };
    const primaryAccountBalance = await this.obpService.getAccountBalance(
      bvnDto,
      primaryAccountNumberDto,
    );

    const isTransferrable = greaterThanOrEqual(
      primaryAccountBalance,
      transferFundsDto.amount,
    );

    if (!isTransferrable) {
      return ResponseDto.generateResponse(InsufficientFunds);
    }

    const balanceAfter = subtract(
      primaryAccountBalance,
      transferFundsDto.amount,
    );

    this.databaseService.debit.create({
      data: {
        description: transferFundsDto.description,
        transferAccountName: transferFundsDto.transferAccountName,
        transferAccountNumber: transferFundsDto.transferAccountNumber,
        transferBankCode: transferFundsDto.transferBankCode,
        amount: toDecimal(transferFundsDto.amount),
        balanceAfter: toDecimal(balanceAfter),
        userId: user.id,
        accountNumber: transferFundsDto.primaryAccountNumber,
      },
    });
  }
}
