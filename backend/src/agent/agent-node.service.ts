import { Injectable } from '@nestjs/common';

import { AgentToolsService } from './agent-tools.service';
import { AgentNode } from './payload/agent.dto';
import { systemPrompt } from './prompts/system-prompt';

@Injectable()
export class AgentNodeService {
  private tools: any;
  private agentNodes: AgentNode[];
  private agentNodeConnections;

  constructor(private agentToolsService: AgentToolsService) {
    this.tools = this.agentToolsService.getTools();
    const systemAgent = {
      name: 'systemAgent',
      prompt: systemPrompt(),
      tools: [this.tools.sumNumbers],
    };

    this.agentNodes = [systemAgent];
    this.agentNodeConnections = [];
  }

  getAgentNodes() {
    return this.agentNodes;
  }

  getAgentNodeConnections() {
    return this.agentNodeConnections;
  }
}
