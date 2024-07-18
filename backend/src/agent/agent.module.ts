import { Module } from '@nestjs/common';

import { AgentFactoryService } from './agent-factory.service';
import { AgentPromptsService } from './agent-prompts.service';
import { AgentSystemsService } from './agent-systems.service';
import { AgentToolsService } from './agent-tools.service';
import { AgentService } from './agent.service';

@Module({
  providers: [
    AgentFactoryService,
    AgentPromptsService,
    AgentToolsService,
    AgentSystemsService,
    AgentService,
  ],
})
export class AgentModule {}
