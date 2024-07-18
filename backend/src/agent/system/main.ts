import { JsonOutputToolsParser } from 'langchain/output_parsers';

import { ChatGroq } from '@langchain/groq';
import { StateGraph } from '@langchain/langgraph';

import {
  agentStateChannels,
  AgentStateChannels,
  createAgent,
  createNode,
} from './agent-factory';
import { getSystemPrompt, members, toolDef } from './agent-prompts';
import { agentSystems } from './agent-systems';

export async function createWorkflow(llm: ChatGroq) {
  const systemPrompt = await getSystemPrompt();
  const supervisorChain = systemPrompt
    .pipe(
      llm.bindTools([toolDef], {
        tool_choice: { type: 'function', function: { name: 'route' } },
      }),
    )
    .pipe(new JsonOutputToolsParser())
    .pipe((x) => x[0].args);

  const workflow = new StateGraph<AgentStateChannels, unknown, string>({
    channels: agentStateChannels,
  });

  for (const agentSystem of agentSystems) {
    const agent = await createAgent(llm, agentSystem.tools, agentSystem.prompt);
    const node = await createNode(agentSystem.name, agent);
    workflow.addNode(agentSystem.name, node);
  }
  workflow.addNode('supervisor', supervisorChain);

  members.forEach((member) => {
    workflow.addEdge(member, 'supervisor');
  });

  workflow.addConditionalEdges('supervisor', (x: AgentStateChannels) => x.next);
  const graph = workflow.compile();
  return graph;
}
