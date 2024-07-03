import { OBPService } from 'src/providers/obp.service';

import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, OBPService],
})
export class AccountModule {}
