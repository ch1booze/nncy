import { dinero } from 'dinero.js';

import { NGN } from '@dinero.js/currencies';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { CreateBudgetDto } from './payload/budget.dto';

@Injectable()
export class CreateBudgetPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const totalAmount = dinero({
      amount: parseInt(value.totalAmount),
      currency: NGN,
    });

    const createBudgetDto: CreateBudgetDto = {
      category: value.category,
      totalAmount,
      startDate: value.startDate,
      refreshCycle: value.refreshCycle,
    };

    return createBudgetDto;
  }
}
