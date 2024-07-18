import { JsonOutputToolsParser } from 'langchain/output_parsers';

import { ChatGroq } from '@langchain/groq';
import { CompiledStateGraph, StateGraph } from '@langchain/langgraph';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AgentFactoryService } from './agent-factory.service';
import { AgentPromptsService } from './agent-prompts.service';
import { AgentSystemsService } from './agent-systems.service';
import { AgentToolsService } from './agent-tools.service';
import { agentStateChannels, AgentStateChannels } from './dto/agent.dto';

@Injectable()
export class AgentService {
  private graph: CompiledStateGraph<AgentStateChannels, unknown, string>;
  private llm: ChatGroq;

  constructor(
    private configService: ConfigService,
    private agentToolsService: AgentToolsService,
    private agentPromptsService: AgentPromptsService,
    private agentFactoryService: AgentFactoryService,
    private agentSystemsService: AgentSystemsService,
  ) {
    async () => {
      const apiKey = this.configService.get<string>('GROQ_API_KEY');
      this.llm = new ChatGroq({ apiKey });
    };
  }

  async createGraph() {
    const systemPrompt = await this.agentPromptsService.getSystemPrompt();
    const toolDef = await this.agentPromptsService.getToolDef();
    const supervisorChain = systemPrompt
      .pipe(
        this.llm.bindTools([toolDef], {
          tool_choice: { type: 'function', function: { name: 'route' } },
        }),
      )
      .pipe(new JsonOutputToolsParser())
      .pipe((x) => x[0].args);

    const workflow = new StateGraph<AgentStateChannels, unknown, string>({
      channels: agentStateChannels,
    });

    const agentSystems = await this.agentSystemsService.getAgentSystems();
    for (const agentSystem of agentSystems) {
      const agent = await this.agentFactoryService.createAgent(
        this.llm,
        agentSystem.tools,
        agentSystem.prompt,
      );
      const node = await this.agentFactoryService.createNode(
        agentSystem.name,
        agent,
      );
      workflow.addNode(agentSystem.name, node);
    }
    workflow.addNode('supervisor', supervisorChain);
    this.agentPromptsService.members.forEach((member) => {
      workflow.addEdge(member, 'supervisor');
    });
  }
}
