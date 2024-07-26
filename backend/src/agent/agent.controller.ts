import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AgentService } from './agent.service';
import { ChatDto } from './payload/agent.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('agent')
@UseGuards(new AuthGuard())
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    return await this.agentService.chat(chatDto);
  }
}
