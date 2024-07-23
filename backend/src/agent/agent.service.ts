import { Groq, LLMAgent } from 'llamaindex';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AgentNodeService } from './agent-node.service';
import { AgentNode, ChatDto } from './payload/agent.dto';

@Injectable()
export class AgentService {
  private llm: Groq;
  private graph: { [key: string]: string[] } = {};
  private agents: { [key: string]: LLMAgent } = {};

  constructor(
    private readonly configService: ConfigService,
    private agentNodeService: AgentNodeService,
  ) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    const model = 'llama3-8b-8192';
    this.llm = new Groq({ apiKey, model });
    this.agentNodes = this.agentNodeService.getAgentNodes();
    this.graph = cytoscape({ elements: [{ data: { id: 'i' } }] });
  }

  private async createAgent(llm, agentNode: AgentNode) {
    return new LLMAgent({
      llm,
      tools: agentNode.tools,
      systemPrompt: agentNode.prompt,
    });
  }

  async chat(chatDto: ChatDto) {
    const result = await this.agents['systemAgent'].chat({
      message: chatDto.message,
    });

    return ResponseDto.generateResponse(IntentIsGotten, result);
  }
}
