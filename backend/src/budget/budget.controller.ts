import { Body, Controller, Post, Session } from '@nestjs/common';

import { BudgetService } from './budget.service';
import { CreateBudgetPipe } from './create-budget.pipe';
import { CreateBudgetDto } from './payload/budget.dto';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create-budget')
  async createBudget(
    @Session() session: SessionContainer,
    @Body(CreateBudgetPipe) createBudgetDto: CreateBudgetDto,
  ) {
    const userId = session.getUserId();
    return await this.budgetService.createBudget(userId, createBudgetDto);
  }
}
