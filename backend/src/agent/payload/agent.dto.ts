import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class AgentNode {
  name: string;
  prompt: string;
  tools: any[];
}

export type AgentNodeConnection = [string, string];
