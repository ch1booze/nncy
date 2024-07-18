import { Module } from '@nestjs/common';

import { AgentFactoryService } from './agent-factory.service';
import { AgentPromptsService } from './agent-prompts.service';
import { AgentSystemsService } from './agent-systems.service';
import { AgentToolsService } from './agent-tools.service';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';

@Module({
  controllers: [AgentController],

  providers: [
    AgentFactoryService,
    AgentPromptsService,
    AgentSystemsService,
    AgentToolsService,
    AgentService,
  ],
})
export class AgentModule {}
