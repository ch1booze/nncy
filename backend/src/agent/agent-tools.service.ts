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
    return `
    Category: ${category}
    Total Amount:  ${totalAmount}
    Refresh Cycle: ${refreshCycle}
    Start Date: ${startDate}
    `;
  };

  private createBudgetTool = FunctionTool.from(this.createBudgetFn, {
    name: 'createBudget',
    description: `
    Use this function to extract the parameters for creating a budget.
    If any required information is missing, ask the user for clarification.
    `,
    parameters: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'A word that describes what the budget is for',
        },
        totalAmount: {
          type: 'number',
          description:
            'The amount of money to be set aside for each budget cycle',
        },
        startDate: {
          type: 'string',
          description: 'The day the budget cycle starts (format: YYYY-MM-DD)',
        },
        refreshCycle: {
          type: 'string',
          description: 'The duration of each budget cycle',
        },
      },
      required: ['category', 'totalAmount', 'startDate', 'refreshCycle'],
    },
  });

  getTools() {
    return { createBudget: this.createBudgetTool };
  }
}
