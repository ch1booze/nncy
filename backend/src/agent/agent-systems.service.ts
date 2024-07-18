import { Injectable } from '@nestjs/common';

import { AgentToolsService } from './agent-tools.service';
import { AgentSystem } from './dto/agent.dto';

@Injectable()
export class AgentSystemsService {
  private sendMoneyTool;
  private getTransactionsTool;

  private agentSystems: AgentSystem[];

  constructor(private agentToolService: AgentToolsService) {
    this.sendMoneyTool = this.agentToolService.sendMoneyTool();
    this.getTransactionsTool = this.agentToolService.getTransactionsTool();

    const sendMoneyAgentSystem = {
      tools: [this.sendMoneyTool],
      prompt: 'Placeholder',
      name: 'send_money',
    };
    const getTransactionAgentSystem = {
      tools: [this.getTransactionsTool],
      prompt: 'Placeholder',
      name: 'get_transactions',
    };

    this.agentSystems = [sendMoneyAgentSystem, getTransactionAgentSystem];
  }

  async getAgentSystems() {
    return this.agentSystems;
  }
}
