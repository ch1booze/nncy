import { JwtAuthGuard } from 'src/user/jwt-auth.guard';

import { Controller, Get, UseGuards } from '@nestjs/common';

import { AgentService } from './agent.service';

@Controller('agent')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get('chat')
  async chat() {
    return await this.agentService.chat();
  }
}
