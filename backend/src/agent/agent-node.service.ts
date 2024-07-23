import { Injectable } from '@nestjs/common';

import { AgentToolsService } from './agent-tools.service';
import { systemPrompt } from './prompts/system-prompt';

@Injectable()
export class AgentNodeService {
  private tools: any;
  private agentNodes;

  constructor(private agentToolsService: AgentToolsService) {
    this.tools = this.agentToolsService.getTools();
    const systemAgent = {
      prompt: systemPrompt(),
      tools: [this.tools.sumNumbers],
    };

    this.agentNodes = { systemAgent: systemAgent };
  }

  getAgentNodes() {
    return this.agentNodes;
  }
}
