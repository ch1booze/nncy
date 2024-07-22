import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  chat: string;
}

export class AgentNode {
  prompt: string;
  tools: any[];
}
