import { toDecimal } from 'dinero.js';
import { DatabaseService } from 'src/database/database.service';
import { ResponseDto } from 'src/response/response.dto';
import { UserDto } from 'src/user/payload/user.dto';

import { Injectable } from '@nestjs/common';

import { CreateBudgetDto } from './payload/budget.dto';
import { BudgetIsCreated } from './payload/budget.response';

@Injectable()
export class BudgetService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createBudget(user: UserDto, createBudgetDto: CreateBudgetDto) {
    await this.databaseService.budget.create({
      data: {
        category: createBudgetDto.category,
        totalAmount: toDecimal(createBudgetDto.totalAmount),
        userId: user.id,
        refreshCycle: createBudgetDto.refreshCycle,
      },
    });

    return ResponseDto.generateResponse(BudgetIsCreated);
  }
}
