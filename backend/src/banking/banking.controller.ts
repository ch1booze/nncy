import { PayloadDto, TokenDto } from 'src/user/dto';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { User } from 'src/user/user.decorator';

import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { BankingService } from './banking.service';
import {
  AccountNumberDto,
  BvnDto,
  TransactionFilterDto,
  TransferFundsDto,
} from './dto';

@Controller('banking')
@UseGuards(JwtAuthGuard)
export class BankingController {
  constructor(private readonly bankingService: BankingService) {}

  @Post('send-bvn-verification')
  async sendBvnVerification(@User() user: PayloadDto, @Body() bvnDto: BvnDto) {
    return await this.bankingService.sendBvnVerification(user, bvnDto);
  }

  @Post('verify-bvn')
  async verifyBvn(@User() user: PayloadDto, @Body() tokenDto: TokenDto) {
    return await this.bankingService.verifyBvn(user, tokenDto);
  }

  @Get('get-accounts-linked-to-bvn')
  async getAccountsLinkedToBvn(@User() user: PayloadDto) {
    return await this.bankingService.getAccountsLinkedToBvn(user);
  }

  @Put('link-accounts')
  async linkAccounts(
    @User() user: PayloadDto,
    @Body() accountNumbers: AccountNumberDto[],
  ) {
    return await this.bankingService.linkAccounts(user, accountNumbers);
  }

  @Get('get-accounts-summary')
  async getAccountsSummary(@User() user: PayloadDto) {
    return await this.bankingService.getAccountsSummary(user);
  }

  @Get('get-account')
  async getAccountByIndex(
    @User() user: PayloadDto,
    @Query('index', ParseIntPipe) index: number,
  ) {
    return await this.bankingService.getAccountById(user, index);
  }

  @Post('get-accounts-balances')
  async getAccountsBalances(
    @User() user: PayloadDto,
    @Body() accountNumbers: AccountNumberDto[],
  ) {
    return await this.bankingService.getAccountsBalances(user, accountNumbers);
  }

  @Get('get-transactions')
  async getTransactions(
    @User() user: PayloadDto,
    @Body() transactionFilterDto: TransactionFilterDto,
  ) {
    return await this.bankingService.getTransactions(
      user,
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
    @User() user: PayloadDto,
    @Body() transferFundDto: TransferFundsDto,
  ) {
    return await this.bankingService.transferFunds(user, transferFundDto);
  }
}
