import { DynamicStructuredTool } from '@langchain/core/tools';
import { getTransactionsTool, sendMoneyTool } from './agent-tools';
import { getTransactionsPrompt, sendMoneyPrompt } from './agent-prompts';

export interface AgentSystem {
  tools: DynamicStructuredTool[];
  prompt: string;
  name: string;
}

const sendMoneyAgentSystem: AgentSystem = {
  tools: [sendMoneyTool],
  prompt: sendMoneyPrompt,
  name: 'send_money',
};

const getTransactionAgentSystem: AgentSystem = {
  tools: [getTransactionsTool],
  prompt: getTransactionsPrompt,
  name: 'get_transactions',
};

export const agentSystems = [sendMoneyAgentSystem, getTransactionAgentSystem];
