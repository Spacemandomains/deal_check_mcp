#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runDealCheck } from "./dealEngine.js";
import { createPaidTransport } from "./payment.js";

const server = new McpServer({
  name: "dealcheck-mcp",
  version: "1.0.0"
});

server.registerTool(
  "deal_check",
  {
    description: "Check if a product is a good deal (Costs $2 via Tempo)",
    inputSchema: {
      product_name: z.string(),
      listed_price: z.number(),
      condition: z.string().optional(),
      marketplace: z.string().optional(),
      category: z.string().optional()
    }
  },
  async (input) => {
    const result = runDealCheck(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }
);

async function main() {
  const transport = createPaidTransport();
  await server.connect(transport);
  console.error("DealCheck MCP running ($2 per call)");
}

main();
