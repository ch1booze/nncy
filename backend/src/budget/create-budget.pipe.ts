import { dinero } from 'dinero.js';

import { NGN } from '@dinero.js/currencies';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { CreateBudgetDto } from './payload/budget.dto';

@Injectable()
export class CreateBudgetPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    const totalAmount = dinero({
      amount: parseInt(value.totalAmount),
      currency: NGN,
    });

    const createBudgetDto: CreateBudgetDto = {
      category: value.category,
      totalAmount,
      refreshCycle: value.refreshCycle,
    };

    return createBudgetDto;
  }
}
