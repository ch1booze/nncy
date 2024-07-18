import { z } from 'zod';

import { DynamicStructuredTool } from '@langchain/core/tools';

export const getTransactionsTool = new DynamicStructuredTool({
  name: 'get_transactions',
  description: 'Get list of transactions',
  schema: z.object({
    data: z
      .object({
        amount: z.number(),
        account: z.string().length(10),
      })
      .array(),
  }),
  func: async ({ data }) => {
    let transactions: string = '';
    data.forEach((d, idx) => {
      transactions += `${idx}: ${d.amount} - ${d.account}`;
    });
    return transactions;
  },
});

export const sendMoneyTool = new DynamicStructuredTool({
  name: 'send_money',
  description: 'Send money on behalf of user',
  schema: z.object({
    data: z.object({
      amount: z.number(),
      account: z.string().length(10),
    }),
  }),
  func: async ({ data }) => {
    return `Sending ${data.amount} to ${data.account}.`;
  },
});
