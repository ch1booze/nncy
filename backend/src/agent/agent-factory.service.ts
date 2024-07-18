import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';

import { HumanMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatGroq } from '@langchain/groq';
import { Injectable } from '@nestjs/common';

import { AgentStateChannels } from './dto/agent.dto';

@Injectable()
export class AgentFactoryService {
  async createAgent(
    llm: ChatGroq,
    tools: DynamicStructuredTool[],
    systemPrompt: string,
  ): Promise<Runnable> {
    const prompt = await ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);
    const agent = await createToolCallingAgent({ llm, tools, prompt });
    return new AgentExecutor({ agent, tools });
  }

  async createNode(name: string, agent: any) {
    return async (state: AgentStateChannels, config: RunnableConfig) => {
      const result = await agent.invoke(state, config);
      return {
        messages: [new HumanMessage({ content: result.output, name })],
      };
    };
  }
}
