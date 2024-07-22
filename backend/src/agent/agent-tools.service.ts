import { FunctionTool } from 'llamaindex';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AgentToolsService {
  private createBudgetFn = ({
    category,
    totalAmount,
    refreshCycle,
    startDate,
  }) => {
    return {
      category,
      totalAmount,
      refreshCycle,
      startDate,
    };
  };

  private createBudgetTool = FunctionTool.from(this.createBudgetFn, {
    name: 'createBudget',
    description:
      'Use this function to extract the parameters for creating a budget. If any required information is missing, ask the user for clarification.',
    parameters: {
      type: 'object',
      required: ['category', 'totalAmount', 'startDate', 'refreshCycle'],
      properties: {
        category: {
          type: 'string',
          description: 'A word that describes what the budget is for',
          pattern: '^[a-zA-Z0-9]+$',
        },
        totalAmount: {
          type: 'number',
          description:
            'The amount of money to be set aside for each budget cycle',
          minimum: 0,
        },
        startDate: {
          type: 'string',
          description: 'The day the budget cycle starts (format: YYYY-MM-DD)',
          pattern: '^d{4}-d{2}-d{2}$',
        },
        refreshCycle: {
          type: 'string',
          description: 'The duration of each budget cycle',
          enum: ['weekly', 'monthly', 'yearly'],
        },
      },
    },
    example:
      'Create a budget of 500 naira monthly for groceries starting from 2023-07-01',
  });

  getTools() {
    return { createBudget: this.createBudgetTool };
  }
}
