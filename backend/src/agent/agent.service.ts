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
import { HumanMessage } from '@langchain/core/messages';
import { ResponseDto } from 'src/response/response.dto';
import { UserAlreadyExists } from 'src/user/dto';

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
    this.init();
  }

  private async init() {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.llm = new ChatGroq({ apiKey });
    await this.createGraph();
  }

  private async createGraph() {
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
      console.log(agentSystem.name);
      workflow.addNode(agentSystem.name, node);
    }

    workflow.addNode('supervisor', supervisorChain);

    this.agentPromptsService.members.forEach((member) => {
      workflow.addEdge(member, 'supervisor');
    });

    workflow.addConditionalEdges(
      'supervisor',
      (x: AgentStateChannels) => x.next,
    );

    this.graph = workflow.compile();
  }

  async chat() {
    console.log(this.graph);
    const streamResults = await this.graph.stream(
      {
        messages: [new HumanMessage({ content: 'What is your name?' })],
      },
      { recursionLimit: 100 },
    );

    for await (const output of streamResults) {
      if (!output?.__end__) {
        console.log(output);
        console.log('---');
      }
    }

    return ResponseDto.generateResponse(UserAlreadyExists);
  }
}
