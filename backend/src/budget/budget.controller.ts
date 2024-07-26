import { AuthGuard } from 'src/auth/auth.guard';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';

import { BudgetService } from './budget.service';
import { CreateBudgetPipe } from './create-budget.pipe';
import { CreateBudgetDto } from './payload/budget.dto';

@Controller('budget')
@UseGuards(new AuthGuard())
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
