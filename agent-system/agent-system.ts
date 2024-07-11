import * as dotenv from "dotenv";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { JsonOutputToolsParser } from "langchain/output_parsers";
import { z } from "zod";

import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Runnable, RunnableConfig } from "@langchain/core/runnables";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGroq } from "@langchain/groq";
import { END, StateGraph, StateGraphArgs } from "@langchain/langgraph";

dotenv.config();

interface AgentStateChannels {
  messages: BaseMessage[];
  next: string;
}

const agentStateChannels: StateGraphArgs<AgentStateChannels>["channels"] = {
  messages: {
    value: (x?: BaseMessage[], y?: BaseMessage[]) => (x ?? []).concat(y ?? []),
    default: () => [],
  },
  next: {
    value: (x?: string, y?: string) => y ?? x ?? END,
    default: () => END,
  },
};

const sendMoneyTool = new DynamicStructuredTool({
  name: "send_money",
  description: "Send money on behalf of user",
  schema: z.object({
    data: z.object({
      amount: z.number(),
      account: z.string().length(10),
    }),
  }),
  func: async ({ data }) => {
    return `Sending ${data.amount} to ${data.account}.`;
  },
});

const getTransactionsTool = new DynamicStructuredTool({
  name: "get_transactions",
  description: "Get list of transactions",
  schema: z.object({
    data: z
      .object({
        amount: z.number(),
        account: z.string().length(10),
      })
      .array(),
  }),
  func: async ({ data }) => {
    let transactions: string = "";
    data.forEach((d, idx) => {
      transactions += `${idx}: ${d.amount} - ${d.account}`;
    });
    return transactions;
  },
});

async function createAgent(
  llm: ChatGroq,
  tools: any[],
  systemPrompt: string
): Promise<Runnable> {
  const prompt = await ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("messages"),
    new MessagesPlaceholder("agent_scratchpad"),
  ]);
  const agent = await createToolCallingAgent({ llm, tools, prompt });
  return new AgentExecutor({ agent, tools });
}

const members = ["send_money", "get_transactions"];
const options = [END, ...members];

const systemPrompt = `You are a supervisor tasked with determining the intent behind what a user's request.
The members are  {members}. The intent selected is then selected to perform a task. 
Once the task is concluded, respond with FINISH.`;

const functionDef = {
  name: "route",
  description: "Select the next role.",
  parameters: {
    title: "routeSchema",
    type: "object",
    properties: {
      next: {
        title: "Next",
        anyOf: [{ enum: options }],
      },
    },
    required: ["next"],
  },
};

const toolDef = {
  type: "function",
  function: functionDef,
} as const;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("messages"),
  [
    "system",
    "Given the conversation above, who should act next?" +
      " Or should we FINISH? Select one of: {options}",
  ],
]);

const formattedPrompt = await prompt.partial({
  options: options.join(", "),
  members: members.join(", "),
});

const llm = new ChatGroq({ apiKey: process.env.GROQ_API_KEY });

const supervisorChain = formattedPrompt
  .pipe(
    llm.bindTools([toolDef], {
      tool_choice: { type: "function", function: { name: "route" } },
    })
  )
  .pipe(new JsonOutputToolsParser())
  .pipe((x) => x[0].args);

const result = await supervisorChain.invoke({
  messages: [
    new HumanMessage({
      content: "I want my transactions from Jan to Mar",
    }),
  ],
});

const sendMoneyAgent = await createAgent(llm, [sendMoneyTool], "You are a ");
const sendMoneyNode = async (
  state: AgentStateChannels,
  config: RunnableConfig
) => {
  const result = await sendMoneyAgent.invoke(state, config);
  return {
    messages: [
      new HumanMessage({ content: result.output, name: "Send Money" }),
    ],
  };
};

const getTransactionsAgent = await createAgent(
  llm,
  [getTransactionsTool],
  "You are a"
);

const getTransactionsNode = async (
  state: AgentStateChannels,
  config?: RunnableConfig
) => {
  const result = await getTransactionsAgent.invoke(state, config);
  return {
    messages: [
      new HumanMessage({ content: result.output, name: "Get Transactions" }),
    ],
  };
};

const workflow = new StateGraph<AgentStateChannels, unknown, string>({
  channels: agentStateChannels,
})
  .addNode("send_money", sendMoneyNode)
  .addNode("get_transactions", getTransactionsNode)
  .addNode("supervisor", supervisorChain);

members.forEach((member) => {
  workflow.addEdge(member, "supervisor");
});

workflow.addConditionalEdges("supervisor", (x: AgentStateChannels) => x.next);
const graph = workflow.compile();

let streamResults = graph.stream(
  {
    messages: [new HumanMessage({ content: "What is your name?" })],
  },
  { recursionLimit: 100 }
);

for await (const output of await streamResults) {
  if (!output?.__end__) {
    console.log(output);
    console.log("---");
  }
}
