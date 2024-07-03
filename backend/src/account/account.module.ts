import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { OBPService } from 'src/providers/obp.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, OBPService],
})
export class AccountModule {}
