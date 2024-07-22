import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { AgentToolsService } from './agent-tools.service';
import { AgentNodeService } from './agent-node.service';

@Module({
  controllers: [AgentController],
  providers: [AgentService, AgentToolsService, AgentNodeService],
})
export class AgentModule {}
