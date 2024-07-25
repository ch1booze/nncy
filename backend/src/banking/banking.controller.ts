import { Session } from 'src/auth/session.decorator';
import { TokenDto } from 'src/user/payload/user.dto';
import { SessionContainer } from 'supertokens-node/recipe/session';

import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { BankingService } from './banking.service';
import {
  AccountNumberDto,
  BvnDto,
  TransactionFilterDto,
  TransferFundsDto,
} from './payload/banking.dto';
import { TransferFundsPipe } from './transfer-funds.pipe';

@Controller('banking')
export class BankingController {
  constructor(private readonly bankingService: BankingService) {}

  @Post('send-bvn-verification')
  async sendBvnVerification(
    @Session() session: SessionContainer,
    @Body() bvnDto: BvnDto,
  ) {
    const userId = session.getUserId();
    return await this.bankingService.sendBvnVerification(userId, bvnDto);
  }

  @Post('verify-bvn')
  async verifyBvn(
    @Session() session: SessionContainer,
    @Body() tokenDto: TokenDto,
  ) {
    const userId = session.getUserId();
    return await this.bankingService.verifyBvn(userId, tokenDto);
  }

  @Get('get-accounts-linked-to-bvn')
  async getAccountsLinkedToBvn(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.bankingService.getAccountsLinkedToBvn(userId);
  }

  @Put('link-accounts')
  async linkAccounts(
    @Session() session: SessionContainer,
    @Body() accountNumbers: AccountNumberDto[],
  ) {
    const userId = session.getUserId();
    return await this.bankingService.linkAccounts(userId, accountNumbers);
  }

  @Get('get-accounts-summary')
  async getAccountsSummary(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.bankingService.getAccountsSummary(userId);
  }

  @Get('get-account')
  async getAccountByIndex(
    @Session() session: SessionContainer,
    @Query('index', ParseIntPipe) index: number,
  ) {
    const userId = session.getUserId();
    return await this.bankingService.getAccountById(userId, index);
  }

  @Post('get-accounts-balances')
  async getAccountsBalances(
    @Session() session: SessionContainer,
    @Body() accountNumbers: AccountNumberDto[],
  ) {
    const userId = session.getUserId();
    return await this.bankingService.getAccountsBalances(
      userId,
      accountNumbers,
    );
  }

  @Get('get-transactions')
  async getTransactions(
    @Session() session: SessionContainer,
    @Body() transactionFilterDto: TransactionFilterDto,
  ) {
    const userId = session.getUserId();
    return await this.bankingService.getTransactions(
      userId,
      transactionFilterDto,
    );
  }

  @Post('get-transfer-account-details')
  async getTransferAccountDetails(
    @Body() transferAccountNumberDto: AccountNumberDto,
  ) {
    return await this.bankingService.getAccountDetails(
      transferAccountNumberDto,
    );
  }

  @Post('transfer-funds')
  async transferFunds(
    @Session() session: SessionContainer,
    @Body(TransferFundsPipe) transferFundDto: TransferFundsDto,
  ) {
    const userId = session.getUserId();
    return await this.bankingService.transferFunds(userId, transferFundDto);
  }
}
