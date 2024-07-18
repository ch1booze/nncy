import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';

import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { Runnable, RunnableConfig } from '@langchain/core/runnables';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatGroq } from '@langchain/groq';
import { END, StateGraphArgs } from '@langchain/langgraph';

export async function createAgent(
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

export interface AgentStateChannels {
  messages: BaseMessage[];
  next: string;
}

export const agentStateChannels: StateGraphArgs<AgentStateChannels>['channels'] =
  {
    messages: {
      value: (x?: BaseMessage[], y?: BaseMessage[]) =>
        (x ?? []).concat(y ?? []),
      default: () => [],
    },
    next: {
      value: (x?: string, y?: string) => y ?? x ?? END,
      default: () => END,
    },
  };

export async function createNode(name: string, agent: any) {
  return async (state: AgentStateChannels, config: RunnableConfig) => {
    const result = await agent.invoke(state, config);
    return {
      messages: [new HumanMessage({ content: result.output, name })],
    };
  };
}
