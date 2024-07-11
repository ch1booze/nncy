import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { Controller, UseGuards } from '@nestjs/common';

import { AgentsService } from './agents.service';

@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}
}
