import { Groq, LLMAgent, Settings } from 'llamaindex';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AgentNodeService } from './agent-node.service';
import { AgentNode, AgentNodeConnection, ChatDto } from './payload/agent.dto';
import { ResponseDto } from 'src/response/response.dto';
import { IntentIsGotten } from './payload/agent.responses';

@Injectable()
export class AgentService {
  private llm: Groq;
  private graph: { [key: string]: string[] } = {};
  private agents: { [key: string]: LLMAgent } = {};
  private logs: any[] = [];

  constructor(
    private readonly configService: ConfigService,
    private agentNodeService: AgentNodeService,
  ) {
    Settings.callbackManager('llm-tool-result', (event) => {
      this.logs.push(event.detail.payload);
    });
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    const model = 'llama3-8b-8192';
    this.llm = new Groq({ apiKey, model });
    this.initializeAgents();
  }

  private async initializeAgents() {
    const agentNodes: AgentNode[] = this.agentNodeService.getAgentNodes();
    const agentNodeConnections: AgentNodeConnection[] =
      this.agentNodeService.getAgentNodeConnections();
    await this.createAgents(agentNodes, agentNodeConnections);
  }

  private async createAgents(
    agentNodes: AgentNode[],
    agentNodeConnections: AgentNodeConnection[],
  ) {
    for (const node of agentNodes) {
      this.agents[node.name] = new LLMAgent({
        llm: this.llm,
        tools: node.tools,
        systemPrompt: node.prompt,
      });
    }

    for (const [source, dest] of agentNodeConnections) {
      if (this.graph.hasOwnProperty(source)) {
        this.graph[source] = [dest];
      } else {
        this.graph[source].push(dest);
      }
    }
  }

  async chat(chatDto: ChatDto) {
    const result = await this.agents.systemAgent.chat({
      message: chatDto.message,
    });

    return ResponseDto.generateResponse(IntentIsGotten, result);
  }
}
