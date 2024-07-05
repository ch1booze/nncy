import { OBPProvider } from 'src/providers/obp.provider';

import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, OBPProvider],
})
export class AccountModule {}
