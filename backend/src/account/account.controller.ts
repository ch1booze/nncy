import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/utils/user.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AccountService } from './account.service';
import { AccountDTO, BVNDTO } from './dto/account.dto';

@Controller('account')
@UseGuards(JWTAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('send-bvn-verification')
  async sendBVNVerification(@User() user: any, @Body() bvnDTO: BVNDTO) {
    const { bvn } = bvnDTO;
    const { email } = user;
    return await this.accountService.sendBVNVerification(email, bvn);
  }

  @Get('get-accounts-linked-to-user')
  async getAccountsLinkedToUser(@User() user: any) {
    const { email } = user;
    return await this.accountService.getAccountsLinkedToUser(email);
  }

  @Post('link-accounts')
  async linkAccounts(@User() user: any, @Body() accounts: AccountDTO[]) {
    const { id } = user;
    return this.accountService.linkAccounts(id, accounts);
  }
}
