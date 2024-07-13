import { PayloadDto, TokenDto } from 'src/auth/dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/utils/user.decorator';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AccountService } from './banking.service';
import { AccountNumberDto, BvnDto } from './dto/banking.dto';

@Controller('banking')
@UseGuards(JwtAuthGuard)
export class BankingController {
  constructor(private readonly bankingService: AccountService) {}

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

  @Get('get-accounts')
  async getAccounts(@User() user: PayloadDto) {
    return await this.bankingService.getAccountsSummary(user);
  }

  @Get('get-account/:index')
  async getAccountByIndex(
    @User() user: PayloadDto,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return await this.bankingService.getAccountById(user, index);
  }

  @Get('get-accounts-balances')
  async getAccountsBalances(
    @User() user: PayloadDto,
    @Body() accountNumbers: AccountNumberDto[],
  ) {
    return await this.bankingService.getAccountsBalances(user, accountNumbers);
  }
}
