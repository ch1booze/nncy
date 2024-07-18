import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { END } from '@langchain/langgraph';

import { prompts } from './prompt-list';

// Supervisor Prompt
export const instruction = prompts.system_prompt.instruction;
export const context = prompts.system_prompt.context;

// Agent Prompts
export const sendMoneyPrompt = prompts['send_money'];
export const getTransactionsPrompt = prompts['get_transactions'];

// Members and Options
export const members = ['send_money', 'get_transactions'];
export const options = [END, ...members];

export async function getSystemPrompt() {
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', instruction],
    new MessagesPlaceholder('messages'),
    ['system', context],
  ]);

  return await prompt.partial({
    options: options.join(', '),
    members: members.join(', '),
  });
}

const functionDef = {
  name: 'route',
  description: 'Select the next role.',
  parameters: {
    title: 'routeSchema',
    type: 'object',
    properties: {
      next: {
        title: 'Next',
        anyOf: [{ enum: options }],
      },
    },
    required: ['next'],
  },
};

export const toolDef = {
  type: 'function',
  function: functionDef,
} as const;
