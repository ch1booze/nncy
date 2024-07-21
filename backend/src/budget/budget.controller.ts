import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { UserDto } from 'src/user/payload/user.dto';
import { User } from 'src/user/user.decorator';

import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { BudgetService } from './budget.service';
import { CreateBudgetPipe } from './create-budget.pipe';
import { CreateBudgetDto } from './payload/budget.dto';

@Controller('budget')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create-budget')
  async createBudget(
    @User() user: UserDto,
    @Body(CreateBudgetPipe) createBudgetDto: CreateBudgetDto,
  ) {
    return await this.budgetService.createBudget(user, createBudgetDto);
  }
}
