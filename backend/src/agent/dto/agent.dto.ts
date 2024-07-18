import { BaseMessage } from '@langchain/core/messages';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { END, StateGraphArgs } from '@langchain/langgraph';

export interface AgentStateChannels {
  messages: BaseMessage[];
  next: string;
}

export interface AgentSystem {
  tools: DynamicStructuredTool[];
  prompt: string;
  name: string;
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
