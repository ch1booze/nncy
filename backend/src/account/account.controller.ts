import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/utils/user.decorator';

import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { AccountService } from './account.service';
import { AccountDTO, BvnDTO, VerifyBvnDTO } from './dto/account.dto';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('send-bvn-verification')
  async sendBvnVerification(@User() user: any, @Body() bvnDTO: BvnDTO) {
    const { bvn } = bvnDTO;
    const { email } = user;
    return await this.accountService.sendBvnVerification(email, bvn);
  }

  @Post('verify-bvn')
  async verifyBvn(@User() user: any, @Body() verifyBvnDTO: VerifyBvnDTO) {
    const { email } = user;
    return await this.accountService.verifyBvn(email, verifyBvnDTO);
  }

  @Get('get-accounts-linked-to-user')
  async getAccountsLinkedToUser(@User() user: any) {
    const { id } = user;
    return await this.accountService.getAccountsLinkedToUser(id);
  }

  @Put('link-accounts')
  async linkAccounts(@User() user: any, @Body() accounts: AccountDTO[]) {
    const { id } = user;
    return this.accountService.linkAccounts(id, accounts);
  }
}
