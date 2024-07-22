import { Injectable } from '@nestjs/common';
import { FunctionTool } from 'llamaindex';

@Injectable()
export class AgentToolsService {
  private sumNumbersFn = ({ a, b }) => {
    return `${a + b}`;
  };

  private sumNumbersTool = FunctionTool.from(this.sumNumbersFn, {
    name: 'sumNumbers',
    description: 'Use this function to sum two numbers',
    parameters: {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          description: 'First number to sum',
        },
        b: {
          type: 'number',
          description: 'Second number to sum',
        },
      },
      required: ['a', 'b'],
    },
  });

  getTools() {
    return { sumNumbers: this.sumNumbersTool };
  }
}
