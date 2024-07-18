import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { END } from '@langchain/langgraph';
import { Injectable } from '@nestjs/common';

import { prompts } from './prompt-list';

@Injectable()
export class AgentPromptsService {
  members = ['send_money', 'get_transactions'];
  options = [END, ...this.members];

  async getToolDef() {
    const functionDef = {
      name: 'route',
      description: 'Select the next role.',
      parameters: {
        title: 'routeSchema',
        type: 'object',
        properties: {
          next: {
            title: 'Next',
            anyOf: [{ enum: this.options }],
          },
        },
        required: ['next'],
      },
    };

    return {
      type: 'function',
      function: functionDef,
    } as const;
  }

  async getSystemPrompt() {
    const instruction = prompts.system_prompt.instruction;
    const context = prompts.system_prompt.context;
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', instruction],
      new MessagesPlaceholder('messages'),
      ['system', context],
    ]);

    return await prompt.partial({
      options: this.options.join(', '),
      members: this.members.join(', '),
    });
  }

  async getAgentPrompts() {
    const sendMoneyPrompt = prompts.send_money;
    const getTransactionsPrompt = prompts.get_transactions;

    return { sendMoneyPrompt, getTransactionsPrompt };
  }
}
