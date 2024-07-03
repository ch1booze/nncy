import { Body, Controller, Get, UseGuards } from '@nestjs/common';

import { AccountService } from './account.service';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('account')
@UseGuards(JWTAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('get-accounts-linked-to-user')
  async getAccountsLinkedToUser(@Body('bvn') bvn: string) {
    return await this.accountService.getAccountsLinkedToUser(bvn);
  }
}
