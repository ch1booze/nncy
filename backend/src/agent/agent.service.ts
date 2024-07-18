import { ChatGroq } from '@langchain/groq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createWorkflow } from './system/main';
import { CompiledStateGraph } from '@langchain/langgraph';
import { AgentStateChannels } from './system/agent-factory';

@Injectable()
export class AgentService {
  private graph: CompiledStateGraph<AgentStateChannels, unknown, string>;

  constructor(private configService: ConfigService) {
    async () => {
      const apiKey = this.configService.get<string>('GROQ_API_KEY');
      const llm = new ChatGroq({ apiKey });
      this.graph = await createWorkflow(llm);
    };
  }
}
