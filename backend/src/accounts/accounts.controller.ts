import { Body, Controller, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Post('verify-bvn')
  async verifyBvn(@Body() bvn: string) {
    return this.accountsService.verifyBvn(bvn);
  }
}
