import { PayloadDto } from 'src/auth/dto';
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

import { AccountService } from './account.service';
import { AccountDto, BvnDto, VerifyBvnDto } from './dto/account.dto';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('send-bvn-verification')
  async sendBvnVerification(@User() user: PayloadDto, @Body() bvnDto: BvnDto) {
    return await this.accountService.sendBvnVerification(user, bvnDto);
  }

  @Post('verify-bvn')
  async verifyBvn(
    @User() user: PayloadDto,
    @Body() verifyBvnDto: VerifyBvnDto,
  ) {
    return await this.accountService.verifyBvn(user, verifyBvnDto);
  }

  @Get('get-accounts-linked-to-user')
  async getAccountsLinkedToUser(@User() user: PayloadDto) {
    return await this.accountService.getAccountsLinkedToUser(user);
  }

  @Put('link-accounts')
  async linkAccounts(@User() user: PayloadDto, @Body() accounts: AccountDto[]) {
    return await this.accountService.linkAccounts(user, accounts);
  }

  @Get('get-accounts')
  async getAccounts(@User() user: PayloadDto) {
    return await this.accountService.getAccounts(user);
  }

  @Get('get-account/:id')
  async getAccountById(
    @User() user: PayloadDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.accountService.getAccountById(user, id);
  }
}
