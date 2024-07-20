import Groq from 'groq-sdk';
import { ResponseDto } from 'src/response/response.dto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { systemPrompt } from './agent.prompts';
import { ChatDto } from './payload/agent.dto';
import { IntentIsGotten } from './payload/agent.responses';

@Injectable()
export class AgentService {
  private llm: Groq;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    this.llm = new Groq({ apiKey });
  }

  async getIntent(chatDto: ChatDto) {
    const chatCompletion = await this.llm.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: chatDto.chat },
      ],
      model: 'llama3-8b-8192',
    });

    return ResponseDto.generateResponse(
      IntentIsGotten,
      chatCompletion.choices[0].message.content,
    );
  }
}
