import { Controller, Post } from '@nestjs/common';

import { BudgetService } from './budget.service';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create-budget')
  async createBudget() {}
}
