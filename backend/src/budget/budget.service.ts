import { CronJob } from 'cron';
import { toDecimal } from 'dinero.js';
import { DateTime } from 'luxon';
import { DatabaseService } from 'src/database/database.service';
import { ResponseDto } from 'src/response/response.dto';
import { UserDto } from 'src/user/payload/user.dto';

import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { CreateBudgetDto } from './payload/budget.dto';
import { BudgetIsCreated } from './payload/budget.response';

@Injectable()
export class BudgetService {
  constructor(
    private databaseService: DatabaseService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async createBudget(user: UserDto, createBudgetDto: CreateBudgetDto) {
    const createdBudget = await this.databaseService.budget.create({
      data: {
        category: createBudgetDto.category,
        totalAmount: toDecimal(createBudgetDto.totalAmount),
        startDate: createBudgetDto.startDate,
        refreshCycle: createBudgetDto.refreshCycle,
        userId: user.id,
      },
    });
    await this.startBudget(createdBudget.id, createdBudget.refreshCycle);

    return ResponseDto.generateResponse(BudgetIsCreated);
  }

  private async startBudget(budgetId: string, refreshCycle: string) {
    const cronPattern = await this.computeCronPattern(refreshCycle);
    const budgetJob = new CronJob(cronPattern, async () => {
      await this.updateBudget(budgetId, refreshCycle);
    });
    this.schedulerRegistry.addCronJob(budgetId, budgetJob);
  }

  private async computeCronPattern(refreshCycle: string) {
    const today = DateTime.now().weekday;
    const [multiple, interval] = refreshCycle.split(' ');
    let cronPattern: string;

    if (interval === 'days') {
      cronPattern = `0 0 */${Number(multiple)} * * `;
    } else if (interval === 'weeks') {
      cronPattern = `0 0 ${today} * */${Number(multiple)}`;
    } else if (interval === 'months') {
      cronPattern = `0 0 1 * */${Number(multiple)}`;
    }

    return cronPattern;
  }

  private async updateBudget(budgetId: string, refreshCycle: string) {
    const today = DateTime.now();
    let newEndDate: DateTime;
    const [multiple, interval] = refreshCycle.split(' ');
    if (interval === 'days') {
      newEndDate = today.plus({ days: Number(multiple) });
    } else if (interval === 'weeks') {
      newEndDate = today.plus({ weeks: Number(multiple) });
    } else if (interval === 'months') {
      newEndDate = today.plus({ months: Number(multiple) });
    }

    await this.databaseService.budget.update({
      where: { id: budgetId },
      data: {
        spentAmount: 0,
        endDate: newEndDate.toISO(),
      },
    });
  }
}
