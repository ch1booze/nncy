import { Body, Controller, Post } from '@nestjs/common';

import { AgentService } from './agent.service';
import { ChatDto } from './payload/agent.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    return await this.agentService.chat(chatDto);
  }
}
