import { UserDto } from 'src/user/payload/user.dto';
import { User } from 'src/user/user.decorator';

import { Body, Controller, Post } from '@nestjs/common';

import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './payload/budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create-budget')
  async createBudget(
    @User() user: UserDto,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return await this.budgetService.createBudget(user, createBudgetDto);
  }
}
