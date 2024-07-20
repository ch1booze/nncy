import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
